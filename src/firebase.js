// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-4nctSOap7w9qQbBJg4_0Zk4HyApocgw",
  authDomain: "finance-traker-5a750.firebaseapp.com",
  projectId: "finance-traker-5a750",
  storageBucket: "finance-traker-5a750.appspot.com",
  messagingSenderId: "337186215842",
  appId: "1:337186215842:web:23815f6bf23ac9c5de44fb",
  measurementId: "G-SR5Q5VCXYR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
