/**
 * push-to-firestore.mjs
 * Reads data/website-data.json and writes it to Firestore via REST API
 * Uses the same Firebase project as the app (rise-la)
 */
import { readFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const PROJECT_ID = 'rise-la';
const API_KEY = 'AIzaSyCLGyE05LWtPW3KKAn-jKK0sdGEPk0RpOw';

// Read the local data file
const data = JSON.parse(readFileSync('./data/website-data.json', 'utf8'));

/**
 * Convert a JS value to Firestore REST API format
 */
function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return { integerValue: String(val) };
    return { doubleValue: val };
  }
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

/**
 * Convert the top-level data object to Firestore document fields
 */
function toFirestoreDocument(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    fields[k] = toFirestoreValue(v);
  }
  return { fields };
}

async function pushToFirestore() {
  const docBody = toFirestoreDocument(data);

  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/website/data?key=${API_KEY}`;

  console.log('Pushing data to Firestore...');
  console.log(`  Journal pubs: ${data.journalPubs?.length}`);
  console.log(`  Conf pubs: ${data.confPubs?.length}`);

  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(docBody),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('❌ Failed to push to Firestore:', response.status, err);
    process.exit(1);
  }

  const result = await response.json();
  console.log('✅ Successfully pushed to Firestore!');
  console.log('   Document:', result.name);
}

pushToFirestore().catch(console.error);
