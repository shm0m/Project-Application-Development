// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBW90NVcmDEHPpHMjRpoxTeaSUPnhSoyo0",
  authDomain: "dietethic-5d645.firebaseapp.com",
  databaseURL: "https://dietethic-5d645-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dietethic-5d645",
  storageBucket: "dietethic-5d645.firebasestorage.app",
  messagingSenderId: "307735843491",
  appId: "1:307735843491:web:40cc45538573628f3c6516",
  measurementId: "G-9KJ48YMB75"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);
