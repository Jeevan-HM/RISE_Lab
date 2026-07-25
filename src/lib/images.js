import { uploadImageToGitHub } from './githubSync';

/**
 * Resolve a stored image value into a usable <img src>.
 * Uploaded images are full URLs (raw.githubusercontent.com or data: URIs);
 * legacy values are bare filenames that live in public/images/<folder>/.
 */
export function resolveImagePath(value, folder = '') {
  if (!value) return '';
  if (value.startsWith('http') || value.startsWith('data:')) return value;
  const base = import.meta.env.BASE_URL;
  return folder ? `${base}images/${folder}/${value}` : `${base}images/${value}`;
}

/**
 * Upload an image file to the site's GitHub repo (under public/images/)
 * and return a URL that serves it immediately, no rebuild required.
 */
export async function uploadImage(file, folder = '') {
  return uploadImageToGitHub(file, folder);
}
