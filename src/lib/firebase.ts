import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Exact Firebase configuration provided
const firebaseConfig = {
  apiKey: "AIzaSyCF56jC0YZm9Ed7UnmU7tIo0u3RdN9fvTs",
  authDomain: "k-tech-91929.firebaseapp.com",
  projectId: "k-tech-91929",
  storageBucket: "k-tech-91929.firebasestorage.app",
  messagingSenderId: "494529627026",
  appId: "1:494529627026:web:81e5896287103f9a47b74b",
  measurementId: "G-SDJ9W8VETB"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;
const googleProvider = new GoogleAuthProvider();

try {
  if (typeof window !== "undefined") {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    isSupported().then((supported) => {
      if (supported && app) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {
      // Analytics not supported in some browser environments
    });
  }
} catch (error) {
  console.warn("Firebase initialization warning (using local fallback mode):", error);
}

export { app, auth, db, analytics, googleProvider, firebaseConfig };
