import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration from user console
const firebaseConfig = {
  apiKey: "AIzaSyAwX8vLRJPPqF3ym22xJVTXAxpIF6LhQNI",
  authDomain: "portfolio-1749c.firebaseapp.com",
  projectId: "portfolio-1749c",
  storageBucket: "portfolio-1749c.firebasestorage.app",
  messagingSenderId: "787301633131",
  appId: "1:787301633131:web:9cdb039d71d683bab6f52e",
  measurementId: "G-R3D8WVY8LW"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export Firestore reference
export const db = getFirestore(app);
