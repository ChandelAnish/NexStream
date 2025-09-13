import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey:process.env.NEXT_PUBLIC_APIKEY,
  authDomain:process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId:process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket:process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId:process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId:process.env.NEXT_PUBLIC_APPID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
/*
getApps() → checks if any Firebase app has already been initialized.

If no app is initialized then --> initializeApp(firebaseConfig):
        - Firebase internally assigns that app as the default app (unless you specify a name).
        - If you don't give it a name like initializeApp(config, 'customAppName'), then it's considered the default.

getApp() --> It returns the default initialized app — the one you initialized first without a custom name.
*/

const auth = getAuth(app) // This line gets the Firebase Authentication instance associated with your initialized Firebase app (app) — so you can use it to log in users, send OTPs, sign out, etc.

const db = getFirestore(app) // This is your Firestore database instance
const realtimeDB = getDatabase(app);
export {app, auth, db, realtimeDB}