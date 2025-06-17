
// Firebase SDK initialization (safe to commit, but REPLACE WITH YOUR PROJECT VALUES before using!)
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCroIhoSwbMFgzWZvTVmb3I9TZUTpE9zr8",
  authDomain: "kisankhata-71990.firebaseapp.com",
  projectId: "kisankhata-71990",
  storageBucket: "kisankhata-71990.firebasestorage.app",
  messagingSenderId: "582468827692",
  appId: "1:582468827692:web:875008c4571c3f40086f89",
  measurementId: "G-20L8PKXK7N"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
