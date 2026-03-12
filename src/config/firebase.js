import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// TODO: Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBajHgwfDlWvvNqeJUaN8r3H3G3HNISqJk",
    authDomain: "jobconnect-b8585.firebaseapp.com",
    projectId: "jobconnect-b8585",
    storageBucket: "jobconnect-b8585.firebasestorage.app",
    messagingSenderId: "113125818045",
    appId: "1:113125818045:web:1e736c335f09ee127d81d4",
    measurementId: "G-NWWDC3KQP7"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

