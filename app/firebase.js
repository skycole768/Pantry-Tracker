// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAdGFmnh-b_xBxJzJ5FfqKhDyp7WTgGOZM",
    authDomain: "pantryapp-e33a3.firebaseapp.com",
    projectId: "pantryapp-e33a3",
    storageBucket: "pantryapp-e33a3.appspot.com",
    messagingSenderId: "363738435479",
    appId: "1:363738435479:web:147b0fc7af812762147ed2",
    measurementId: "G-VJ4J5B1808"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)
export{app, firestore, firebaseConfig}


