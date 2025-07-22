import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCrEnwkkEX0pFKY5UJVmkCU1L2OEsIECrk",
  authDomain: "fademart-32de5.firebaseapp.com",
  projectId: "fademart-32de5",
  storageBucket: "fademart-32de5.firebasestorage.app",
  messagingSenderId: "755726899118",
  appId: "1:755726899118:web:b49445f6bd31953f5e1a3f",
  measurementId: "G-N7S58YEDTH"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
