// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCoQ_PoSt8jN_6lCuNeJLh1cDAhjusZpFU",
    authDomain: "dijitalpano-6de73.firebaseapp.com",
    projectId: "dijitalpano-6de73",
    storageBucket: "dijitalpano-6de73.firebasestorage.app",
    messagingSenderId: "350715648948",
    appId: "1:350715648948:web:24fc2bd8ddaf2f1400b0e1",
    measurementId: "G-NJMPP9T11X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore with Long Polling to bypass firewalls/proxies
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});
