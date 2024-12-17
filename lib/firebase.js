// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import { getFirestore } from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBAE_API,
  authDomain: "assignmet-allianz.firebaseapp.com",
  projectId: "assignmet-allianz",
  storageBucket: "assignmet-allianz.appspot.com",
  messagingSenderId: "244684171265",
  appId: "1:244684171265:web:2ec02dc8ddbc26a18c3800",
  measurementId: "G-9FQTNMQG28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)
export const db = getFirestore(app)