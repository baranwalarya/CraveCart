// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "cravecart-delivery.firebaseapp.com",
  projectId: "cravecart-delivery",
  storageBucket: "cravecart-delivery.firebasestorage.app",
  messagingSenderId: "303154125228",
  appId: "1:303154125228:web:66a619390a673f7a158209"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth}