import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyDdYTSqmCVhmY0IC9APAe55OQB_XMsA8i4",
    authDomain: "tuneshare-95b52.firebaseapp.com",
    projectId: "tuneshare-95b52",
    storageBucket: "tuneshare-95b52.appspot.com",
    messagingSenderId: "771574126268",
    appId: "1:771574126268:web:be20a00f374d46a220a2b9"
};
//init firebase
firebase.initializeApp(firebaseConfig)
//init services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();
//timestamp
const timestamp = firebase.firestore.FieldValue.serverTimestamp
export{ projectFirestore, projectAuth, projectStorage , timestamp}
