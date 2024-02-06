// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwvG_wi1P-l26X61rXuGVreCujDoKj9g0",
  authDomain: "ecommerce-appleworld.firebaseapp.com",
  projectId: "ecommerce-appleworld",
  storageBucket: "ecommerce-appleworld.appspot.com",
  messagingSenderId: "1011858121088",
  appId: "1:1011858121088:web:61ddba1883a3a615f9e165"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;