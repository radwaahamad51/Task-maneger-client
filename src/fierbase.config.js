import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4Jaa3YUvjrcCbgrJJwkj6nq0LDROjfPU",
  authDomain: "tesk-managmet.firebaseapp.com",
  projectId: "tesk-managmet",
  storageBucket: "tesk-managmet.firebasestorage.app",
  messagingSenderId: "389290974901",
  appId: "1:389290974901:web:04831c71302ba7d452e8fc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Google Sign-In Function
export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

// Google Sign-Out Function
export const signOutUser = () => {
  return signOut(auth);
};

// Export `onAuthStateChanged` for usage in components
export { onAuthStateChanged };
