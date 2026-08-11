import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCLGyE05LWtPW3KKAn-jKK0sdGEPk0RpOw",
  authDomain: "rise-la.firebaseapp.com",
  projectId: "rise-la",
  storageBucket: "rise-la.firebasestorage.app",
  messagingSenderId: "877881657956",
  appId: "1:877881657956:web:0e9fb95b1de55c8b1cad71"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, 'us-central1');
