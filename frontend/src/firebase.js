import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAM_TF6ks0g0AFONNBeQl7iSRkeL0rYWmc",
    authDomain: "detectify-meta.firebaseapp.com",
    projectId: "detectify-meta",
    storageBucket: "detectify-meta.firebasestorage.app",
    messagingSenderId: "4311950233",
    appId: "1:4311950233:web:33ad5760b0847ef22ce908",
    measurementId: "G-0GKGETS5XS"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
