import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmBr3S0ON2pjiGkw5BLdcJyJbUOx_jOG4",
  authDomain: "trip-planner-73945.firebaseapp.com",
  projectId: "trip-planner-73945",
  storageBucket: "trip-planner-73945.firebasestorage.app",
  messagingSenderId: "739532891653",
  appId: "1:739532891653:web:ab9c14ecba5f49988f5e6c",
  measurementId: "G-NJNYC45DXG"
};

// Prevent multiple app initialization (Next.js requirement)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore DB
export const db = getFirestore(app);
