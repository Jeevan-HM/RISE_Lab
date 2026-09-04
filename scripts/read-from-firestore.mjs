import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

async function checkFirestore() {
  const docRef = doc(db, 'website', 'data');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const d = docSnap.data();
    console.log(`Firestore has: Journal(${d.journalPubs?.length}), Conf(${d.confPubs?.length}), Patent(${d.patentPubs?.length})`);
  } else {
    console.log("No such document!");
  }
  process.exit(0);
}

checkFirestore();
