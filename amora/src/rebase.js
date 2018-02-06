// Import rebase, database, and auth
import Rebase from "re-base";
import firebase from "firebase/app";
import database from "firebase/database";
import "firebase/auth";

// App object for firebase configuration
const app = firebase.initializeApp({
    apiKey: "AIzaSyB10KitQks2up3or-tUPaCw5-zfaSy_KYg",
    authDomain: "team4amora.firebaseapp.com",
    databaseURL: "https://team4amora.firebaseio.com",
    projectId: "team4amora",
    storageBucket: "team4amora.appspot.com",
    messagingSenderId: "694804419013"
});

// const db = database(app);
const rebase = Rebase.createClass(app.database());

// export app, google, or base defaultly
export const auth = app.auth(); 
export const google = new firebase.auth.GoogleAuthProvider();
export default rebase;