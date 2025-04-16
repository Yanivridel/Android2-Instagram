// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {Database , getDatabase} from 'firebase/database'
import { FIREBASE_API_KEY } from '@env';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: "android2-finalproject.firebaseapp.com",
    projectId: "android2-finalproject",
    storageBucket: "android2-finalproject.firebasestorage.app",
    messagingSenderId: "858664579093",
    appId: "1:858664579093:web:59e650d6c9a9daa0c69e1c",
    measurementId: "G-BNKH76RM49"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FirebaseDB = getDatabase(FIREBASE_APP)
const FirebaseAuth = getAuth(FIREBASE_APP)
export { FirebaseAuth }
export default FirebaseDB
