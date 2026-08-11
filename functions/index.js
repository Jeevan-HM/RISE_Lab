/**
 * Firebase Cloud Functions — RISE Lab
 *
 * fetchScholarPublications:
 *   Callable HTTPS function that fetches an author's publications from
 *   Google Scholar via SerpApi, caches results in Firestore for 24h,
 *   and returns a normalized array of publication objects.
 *
 *   The SerpApi key is stored in Firestore at admin/serpapi so it is
 *   NEVER bundled into client-side code.
 *
 * getSerpApiConfig / saveSerpApiConfig:
 *   Callable functions to read/write the SerpApi key from the admin panel.
 *   Only authenticated Firebase users may call these.
 */

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

initializeApp();

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/* ── Helpers ─────────────────────────────────────────────── */

async function getSerpApiKey(db) {
  const snap = await db.collection('admin').doc('serpapi').get();
  if (!snap.exists) return null;
  return snap.data()?.key || null;
}

/**
 * Map a raw SerpApi article entry to our publication schema.
 */
function normalizeArticle(article, authorId) {
  // SerpApi Google Scholar Author API response shape:
  // { title, link, authors, publication, cited_by: { value }, year }
  const year = parseInt(article.year, 10) || new Date().getFullYear();
  const venue = article.publication || '';
  const isConference = /conf|workshop|proceedings|proc\.|symposium|symp\.|ACM|IEEE|AAAI|NeurIPS|ICML|ICLR|CVPR|ECCV|ICCV|EMNLP|ACL|NAACL/i.test(venue);

  return {
    title: article.title || '',
    authors: article.authors || '',
    venue,
    year,
    url: article.link || `https://scholar.google.com/citations?view_op=view_citation&author=${authorId}`,
    citations: article.cited_by?.value || 0,
    _type: isConference ? 'conf' : 'journal', // hint for the UI
    _scholarId: authorId,
    _articleId: article.citation_id || article.link || article.title,
  };
}

/* ── Main function ───────────────────────────────────────── */

exports.fetchScholarPublications = onCall(
  { region: 'us-central1', timeoutSeconds: 30, memory: '256MiB' },
  async (request) => {
    // Require authentication
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in to use this feature.');
    }

    const authorId = request.data?.authorId;
    if (!authorId || typeof authorId !== 'string' || !/^[A-Za-z0-9_-]{6,30}$/.test(authorId)) {
      throw new HttpsError('invalid-argument', 'A valid Google Scholar author ID is required.');
    }

    const db = getFirestore();

    // ── 1. Check cache ──────────────────────────────────────
    const cacheRef = db.collection('scholar_cache').doc(authorId);
    const cacheSnap = await cacheRef.get();
    if (cacheSnap.exists) {
      const cached = cacheSnap.data();
      const age = Date.now() - cached.fetchedAt?.toMillis?.() ?? 0;
      if (age < CACHE_TTL_MS) {
        console.log(`[Scholar] Cache hit for ${authorId} (age ${Math.round(age / 60000)}m)`);
        return { publications: cached.publications, fromCache: true, fetchedAt: cached.fetchedAt?.toDate?.()?.toISOString() };
      }
    }

    // ── 2. Get SerpApi key ──────────────────────────────────
    const apiKey = await getSerpApiKey(db);
    if (!apiKey) {
      throw new HttpsError(
        'failed-precondition',
        'SerpApi key not configured. Go to Admin → Publications → Scholar Settings to add your key.'
      );
    }

    // ── 3. Fetch from SerpApi ───────────────────────────────
    // Use dynamic import for node-fetch (ESM-only in v3+)
    const { default: fetch } = await import('node-fetch');

    const params = new URLSearchParams({
      engine: 'google_scholar_author',
      author_id: authorId,
      api_key: apiKey,
      num: '100',       // fetch up to 100 publications
      sort: 'pubdate',  // newest first
    });

    const url = `https://serpapi.com/search.json?${params.toString()}`;
    console.log(`[Scholar] Fetching publications for author ${authorId}`);

    let serpData;
    try {
      const res = await fetch(url, { timeout: 20000 });
      if (!res.ok) {
        const errText = await res.text();
        console.error(`[Scholar] SerpApi error ${res.status}: ${errText}`);
        throw new HttpsError('internal', `SerpApi returned status ${res.status}. Check your API key.`);
      }
      serpData = await res.json();
    } catch (err) {
      if (err instanceof HttpsError) throw err;
      throw new HttpsError('internal', `Failed to reach SerpApi: ${err.message}`);
    }

    if (serpData.error) {
      throw new HttpsError('internal', `SerpApi error: ${serpData.error}`);
    }

    // ── 4. Normalize ────────────────────────────────────────
    const articles = serpData.articles || [];
    const publications = articles.map(a => normalizeArticle(a, authorId));

    // ── 5. Cache result ─────────────────────────────────────
    await cacheRef.set({
      authorId,
      publications,
      fetchedAt: Timestamp.now(),
      count: publications.length,
    });

    console.log(`[Scholar] Fetched & cached ${publications.length} publications for ${authorId}`);
    return { publications, fromCache: false, fetchedAt: new Date().toISOString() };
  }
);

/* ── SerpApi key management ──────────────────────────────── */

exports.saveSerpApiConfig = onCall(
  { region: 'us-central1' },
  async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Must be signed in.');
    const key = request.data?.key;
    if (!key || typeof key !== 'string') throw new HttpsError('invalid-argument', 'key is required.');
    const db = getFirestore();
    await db.collection('admin').doc('serpapi').set({ key });
    return { ok: true };
  }
);

exports.getSerpApiConfig = onCall(
  { region: 'us-central1' },
  async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Must be signed in.');
    const db = getFirestore();
    const snap = await db.collection('admin').doc('serpapi').get();
    const key = snap.data()?.key || '';
    // Return a masked version for display; never return the full key
    const masked = key ? key.slice(0, 6) + '••••••••••••••••' + key.slice(-4) : '';
    return { configured: !!key, masked };
  }
);
