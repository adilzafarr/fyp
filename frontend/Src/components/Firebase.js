import firebase from 'firebase/compat/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyBTBeSpqagvfpxk_hWpiJoifWh5Q2Ffxfc",
    authDomain: "fa21-69480.firebaseapp.com",
    projectId: "fa21-69480",
    storageBucket: "fa21-69480.firebasestorage.app",
    messagingSenderId: "185154106052",
    appId: "1:185154106052:web:cebb527fff6b9e08264f91",
    measurementId: "G-CYZ03MLYPK"
  };
  const app = firebase.initializeApp(firebaseConfig);
 export const my_auth=getAuth(app);
 export const db  = getFirestore(app);