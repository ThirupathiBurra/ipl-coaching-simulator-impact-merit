// ─── Firebase Config & Initialisation ────────────────────────────────────────
// Fill in .env with your Firebase project values to enable real Firebase.
// Without values the app runs in graceful mock/offline mode.

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// ─── Guard: are real credentials present? ────────────────────────────────────
export function isFirebaseReady() {
  const key = import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDCoLrkcEs1uACYqh5gYi1f2aM7YUfE_Sg";
  return key.length > 0 && key !== "your_firebase_api_key";
}

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || "AIzaSyDCoLrkcEs1uACYqh5gYi1f2aM7YUfE_Sg",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || "ipl-coaching-simulator.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || "ipl-coaching-simulator",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || "ipl-coaching-simulator.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "271846822701",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || "1:271846822701:web:c01021416e8774601179a4",
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     || "",
};

// Singleton initialisation — safe for HMR
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);

// Google provider — request minimal scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

// Analytics — only in production browser context
export const analytics = isFirebaseReady() && typeof window !== "undefined"
  ? isSupported().then((yes) => (yes ? getAnalytics(app) : null)).catch(() => null)
  : null;

// ─── Local Emulator connections (VITE_FIREBASE_USE_EMULATOR=true) ────────────
if (import.meta.env.VITE_FIREBASE_USE_EMULATOR === "true") {
  try {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "localhost", 8080);
    console.info("[Firebase] 🔧 Connected to local emulators");
  } catch {
    // Already connected — ignore in HMR
  }
}

export default app;
