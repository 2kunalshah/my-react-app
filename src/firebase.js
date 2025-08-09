// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAFfRRviR2qxMOLGEkyU62GD02OfUWngn0",
  authDomain: "my-task-app-b32c7.firebaseapp.com",
  projectId: "my-task-app-b32c7",
  storageBucket: "my-task-app-b32c7.firebasestorage.app",
  messagingSenderId: "709002513364",
  appId: "1:709002513364:web:70ceaba290af77190d2441",
  measurementId: "G-CXZ2GKPQGB"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };


