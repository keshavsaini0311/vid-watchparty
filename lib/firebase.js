// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBAE_API,
  authDomain: "real-estate-769c0.firebaseapp.com",
  projectId: "real-estate-769c0",
  storageBucket: "real-estate-769c0.appspot.com",
  messagingSenderId: "894727898351",
  appId: "1:894727898351:web:0966be87d37b4feb56871a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);