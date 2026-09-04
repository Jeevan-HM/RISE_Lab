import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCLGyE05LWtPW3KKAn-jKK0sdGEPk0RpOw",
  authDomain: "rise-la.firebaseapp.com",
  projectId: "rise-la",
  storageBucket: "rise-la.firebasestorage.app",
  messagingSenderId: "877881657956",
  appId: "1:877881657956:web:0e9fb95b1de55c8b1cad71",
  measurementId: "G-4FHVNW78NS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const data = JSON.parse(readFileSync('./data/website-data.json', 'utf8'));

async function pushToFirestore() {
  console.log('Authenticating...');
  try {
    await signInWithEmailAndPassword(auth, 'admin@riselab.com', 'admin@riselab');
    console.log('✅ Authenticated successfully!');
    
    console.log('Pushing data to Firestore via SDK...');
    await setDoc(doc(db, 'website', 'data'), data);
    console.log('✅ Successfully pushed to Firestore!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed:', err);
    process.exit(1);
  }
}

pushToFirestore();
