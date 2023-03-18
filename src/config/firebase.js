// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyBgE1K73_PRnT0PT-wNquQFQwHvTiAoXsY",

  authDomain: "statsjooks-e80dd.firebaseapp.com",

  projectId: "statsjooks-e80dd",

  storageBucket: "statsjooks-e80dd.appspot.com",

  messagingSenderId: "906804871168",

  appId: "1:906804871168:web:f980d084f01bedc20218e5",

  measurementId: "G-GH4ZMWYFH8"

};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db }