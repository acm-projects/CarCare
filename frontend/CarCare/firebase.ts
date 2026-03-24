import { getAuth } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";



const firebaseConfig = {
  apiKey: "AIzaSyDJobLvFnfeYyeJUW0d6QWP-Eb2_3JbGWg",
  authDomain: "fir-1-fa28a.firebaseapp.com",
  projectId: "fir-1-fa28a",
  storageBucket: "fir-1-fa28a.firebasestorage.app",
  messagingSenderId: "536523354519",
  appId: "1:536523354519:web:2f4e5ac4ae17b8c66b94d2"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);