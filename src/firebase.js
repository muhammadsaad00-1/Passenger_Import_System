// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArJ0WmlC60Ga7yBpm6pgfGwaPaWqGCkVE",
  authDomain: "passengerimport-a3e71.firebaseapp.com",
  projectId: "passengerimport-a3e71",
  storageBucket: "passengerimport-a3e71.firebasestorage.app",
  messagingSenderId: "266349926534",
  appId: "1:266349926534:web:9b57a4affd018444bf1907",
  measurementId: "G-5M4L1N9STK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
export { auth, db };


