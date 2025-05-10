// Import the functions you need from the SDKs you need
declare global {
    var firebaseAuth: Auth | undefined;
}

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
    initializeAuth,
    // @ts-ignore
    getReactNativePersistence,
    Auth,
} from "firebase/auth";
// import {Database , getDatabase} from 'firebase/database'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
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

const FIREBASE_APP = initializeApp(firebaseConfig);

if (!globalThis.firebaseAuth) {
    globalThis.firebaseAuth = initializeAuth(FIREBASE_APP, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
}

const FirebaseAuth: Auth = globalThis.firebaseAuth;

const FirebaseDB = getDatabase(FIREBASE_APP);

export { FirebaseAuth };
export default FirebaseDB;