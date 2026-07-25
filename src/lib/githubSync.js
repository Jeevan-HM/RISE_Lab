/**
 * githubSync.js
 *
 * Commits the current website data JSON to a GitHub repository using
 * the GitHub REST API (no server required — runs entirely client-side).
 *
 * GitHub config is stored in Firestore at admin/github so the token
 * is never bundled into the JS source.
 */
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const GITHUB_API = 'https://api.github.com';
const DATA_PATH = 'data/website-data.json';

/** Fetch the saved GitHub config from Firestore */
export async function getGitHubConfig() {
  const snap = await getDoc(doc(db, 'admin', 'github'));
  if (!snap.exists()) return null;
  return snap.data(); // { token, owner, repo, branch }
}

/** Save GitHub config to Firestore */
export async function saveGitHubConfig(config) {
  await setDoc(doc(db, 'admin', 'github'), config);
}

/**
 * Commit the given data object to GitHub.
 * Creates or updates `data/website-data.json` and also writes a
 * timestamped snapshot to `snapshots/YYYY-MM-DDTHH-MM-SS.json`.
 *
 * @param {object} data       - The full liveData object to serialize
 * @param {string} message    - Commit message
 * @returns {{ ok: boolean, commitUrl?: string, error?: string }}
 */
export async function commitToGitHub(data, message = 'Admin save') {
  const config = await getGitHubConfig();
  if (!config?.token || !config?.owner || !config?.repo) {
    return { ok: false, error: 'GitHub not configured. Click ⚙ GitHub in the toolbar.' };
  }

  const { token, owner, repo, branch = 'main' } = config;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const jsonContent = JSON.stringify(data, null, 2);
  const contentB64 = btoa(unescape(encodeURIComponent(jsonContent)));

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  // Commit both the "latest" file and a timestamped snapshot
  const filesToCommit = [
    { path: DATA_PATH, content: contentB64 },
    { path: `snapshots/${timestamp}.json`, content: contentB64 },
  ];

  let lastCommitUrl = null;

  for (const file of filesToCommit) {
    // Get current SHA (needed to update existing file)
    let sha;
    try {
      const res = await fetch(
        `${GITHUB_API}/repos/${owner}/${repo}/contents/${file.path}?ref=${branch}`,
        { headers }
      );
      if (res.ok) {
        const existing = await res.json();
        sha = existing.sha;
      }
    } catch {
      // File doesn't exist yet — sha stays undefined (creates new file)
    }

    const body = {
      message: `${message} — ${new Date().toLocaleString()}`,
      content: file.content,
      branch,
      ...(sha ? { sha } : {}),
    };

    const putRes = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/contents/${file.path}`,
      { method: 'PUT', headers, body: JSON.stringify(body) }
    );

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({}));
      return { ok: false, error: errData.message || `GitHub API error ${putRes.status}` };
    }

    const result = await putRes.json();
    lastCommitUrl = result?.commit?.html_url;
  }

  return { ok: true, commitUrl: lastCommitUrl };
}

/** Read a File as a base64 string (no data: URI prefix). */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image file to the configured GitHub repo under
 * public/images/<folder>/ and return a URL that serves it immediately
 * via raw.githubusercontent.com (no rebuild/deploy required).
 */
export async function uploadImageToGitHub(file, folder = '') {
  const config = await getGitHubConfig();
  if (!config?.token || !config?.owner || !config?.repo) {
    throw new Error('GitHub not configured. Click ⚙ GitHub in the toolbar.');
  }

  const { token, owner, repo, branch = 'main' } = config;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const dir = folder ? `${folder}/` : '';
  const path = `public/images/${dir}${Date.now()}_${safeName}`;
  const content = await fileToBase64(file);

  const putRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Upload image: ${path}`,
        content,
        branch,
      }),
    }
  );

  if (!putRes.ok) {
    const errData = await putRes.json().catch(() => ({}));
    throw new Error(errData.message || `GitHub upload failed (${putRes.status})`);
  }

  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

/**
 * Fetch the list of commits that touched website-data.json.
 * Returns array of { sha, message, date, author, url }.
 */
export async function fetchCommitHistory(limit = 30) {
  const config = await getGitHubConfig();
  if (!config?.token || !config?.owner || !config?.repo) return [];

  const { token, owner, repo, branch = 'main' } = config;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/commits?path=${DATA_PATH}&sha=${branch}&per_page=${limit}`,
    { headers }
  );
  if (!res.ok) return [];

  const commits = await res.json();
  return commits.map(c => ({
    sha: c.sha,
    message: c.commit.message,
    date: new Date(c.commit.author.date),
    author: c.commit.author.name,
    url: c.html_url,
  }));
}

/**
 * Fetch the data JSON from a specific commit SHA.
 * Returns the parsed object, or null on failure.
 */
export async function fetchDataAtCommit(sha) {
  const config = await getGitHubConfig();
  if (!config?.token || !config?.owner || !config?.repo) return null;

  const { token, owner, repo } = config;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${DATA_PATH}?ref=${sha}`,
    { headers }
  );
  if (!res.ok) return null;

  const file = await res.json();
  try {
    const decoded = decodeURIComponent(escape(atob(file.content.replace(/\n/g, ''))));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
