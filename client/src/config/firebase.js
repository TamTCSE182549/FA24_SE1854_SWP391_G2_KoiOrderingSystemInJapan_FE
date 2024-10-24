// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8maxoLszERSFaelkk5796LtxQU3kz3bc",
  authDomain: "swp301-964b5.firebaseapp.com",
  projectId: "swp301-964b5",
  storageBucket: "swp301-964b5.appspot.com",
  messagingSenderId: "884448274461",
  appId: "1:884448274461:web:c8ea34a97ea40f68cefef4",
  measurementId: "G-V8PL7SGXN7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
