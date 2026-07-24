// Run this in the browser console while on the admin page
// OR: In edit mode, just click "+ Add" under Post-Doctoral Researchers
// This is a reference for what the data shape should look like:

// postdocStudents: [
//   { name: 'xyz', photo: 'sundevil.jpg', info: 'Post-Doctoral Researcher', email: '' }
// ]

// ── Or use this snippet in the browser console (admin page) ──
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './src/firebase.js';

await updateDoc(doc(db, 'website', 'data'), {
  postdocStudents: [
    { name: 'xyz', photo: 'sundevil.jpg', info: 'Post-Doctoral Researcher', email: '' }
  ]
});
