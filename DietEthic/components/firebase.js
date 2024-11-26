// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAGM0jPXJUz2XzERcGDcdbVr5oHtXFR-UU",
  authDomain: "dietethic-ec288.firebaseapp.com",
  projectId: "dietethic-ec288",
  storageBucket: "dietethic-ec288.firebasestorage.app",
  messagingSenderId: "953614432674",
  appId: "1:953614432674:web:4aded64bf311b016a3dafb",
  measurementId: "G-0T00K3EDG4"
};


const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };