// ─── Auth Service ─────────────────────────────────────────────────────────────
// Thin wrapper around Firebase Auth. All functions are no-ops when Firebase
// is not configured (isFirebaseReady() === false).

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseReady } from "./firebase";

// ─── Map Firebase user → app user shape ───────────────────────────────────────
export function mapFirebaseUser(fbUser) {
  if (!fbUser) return null;
  return {
    uid:         fbUser.uid,
    displayName: fbUser.displayName ?? fbUser.email?.split("@")[0] ?? "Coach",
    email:       fbUser.email ?? "",
    photoURL:    fbUser.photoURL ?? null,
    // App-specific defaults (will be overwritten by Firestore profile)
    badge:           "AMATEUR",
    imsTotal:        0,
    imsRank:         null,
    decisionsCount:  0,
    accuracy:        0,
    streak:          0,
    matchesPlayed:   0,
    joinedAt:        new Date().toISOString(),
  };
}

// ─── Google Sign-In ───────────────────────────────────────────────────────────
export async function signInWithGoogle() {
  if (!isFirebaseReady()) {
    console.warn("[Auth] Firebase not configured — sign-in skipped.");
    return { success: false, error: "Firebase not configured. Add credentials to .env." };
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user, isNew: result._tokenResponse?.isNewUser ?? false };
  } catch (err) {
    console.error("[Auth] Google sign-in error:", err);
    const messages = {
      "auth/popup-closed-by-user":    "Sign-in cancelled.",
      "auth/network-request-failed":  "Network error — check your connection.",
      "auth/popup-blocked":           "Popup blocked — please allow popups for this site.",
    };
    return { success: false, error: messages[err.code] ?? err.message };
  }
}

// ─── Email/Password Sign-In ───────────────────────────────────────────────────
export async function signInWithEmail(email, password) {
  if (!isFirebaseReady()) return { success: false, error: "Firebase not configured." };
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (err) {
    const messages = {
      "auth/user-not-found":    "No account found with this email.",
      "auth/wrong-password":    "Incorrect password.",
      "auth/invalid-email":     "Invalid email address.",
      "auth/too-many-requests": "Too many attempts — try again later.",
    };
    return { success: false, error: messages[err.code] ?? err.message };
  }
}

// ─── Email/Password Sign-Up ───────────────────────────────────────────────────
export async function signUpWithEmail(email, password, displayName) {
  if (!isFirebaseReady()) return { success: false, error: "Firebase not configured." };
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(result.user, { displayName });
    return { success: true, user: result.user, isNew: true };
  } catch (err) {
    const messages = {
      "auth/email-already-in-use": "An account already exists with this email.",
      "auth/weak-password":        "Password must be at least 6 characters.",
    };
    return { success: false, error: messages[err.code] ?? err.message };
  }
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────
export async function signOutUser() {
  if (!isFirebaseReady()) return;
  try {
    await signOut(auth);
  } catch (err) {
    console.error("[Auth] Sign-out error:", err);
  }
}

// ─── Auth State Listener ──────────────────────────────────────────────────────
/**
 * Subscribe to Firebase auth state changes.
 * @param {function} callback - Called with (user | null) on every change
 * @returns {function} Unsubscribe function
 */
export function onAuthChange(callback) {
  if (!isFirebaseReady()) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
