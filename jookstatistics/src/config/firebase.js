/* ------------------------------------------------ */
/*  Configuration de la connexion à la bdd firebase */
/* ------------------------------------------------ */

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// configuration de la bdd firebase
const firebaseConfig = {
    apiKey: "AIzaSyD3OUzePsKXqK5lPzESz_1jH7fLYwYNruk",

  authDomain: "jooksstatistics.firebaseapp.com",

  projectId: "jooksstatistics",

  storageBucket: "jooksstatistics.appspot.com",

  messagingSenderId: "819920363963",

  appId: "1:819920363963:web:bb9d4717a65d2788c5249e",

  measurementId: "G-PSQEJNE30F"

  
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db }