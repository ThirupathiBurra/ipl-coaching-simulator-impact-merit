// ─── useAuth — Real Firebase Auth Hook ────────────────────────────────────────
import { useEffect, useState } from "react";
import { useUserStore } from "@store/userStore";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  onAuthChange,
  mapFirebaseUser,
} from "@services/authService";
import { getUserProfile, createUserProfile, updateUserProfile } from "@services/firestoreService";
import { isFirebaseReady } from "@services/firebase";

// ─── useAuth ──────────────────────────────────────────────────────────────────
/**
 * Provides auth actions and current user state to any component.
 */
export function useAuth() {
  const { user, isAuthenticated, setUser, logout, setLoading } = useUserStore();
  const [authError, setAuthError] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // ── Google Sign-In ────────────────────────────────────────────────────────
  async function loginWithGoogle() {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setAuthError(result.error);
        return;
      }
      const fbUser    = result.user;
      const appUser   = mapFirebaseUser(fbUser);

      // Sync with Firestore: create profile on first login, fetch on return
      await createUserProfile(fbUser.uid, appUser);
      const profile = await getUserProfile(fbUser.uid);
      setUser(profile ?? appUser);
    } catch (err) {
      setAuthError("Unexpected error during sign-in.");
      console.error("[useAuth] loginWithGoogle:", err);
    } finally {
      setIsSigningIn(false);
    }
  }

  // ── Email Sign-In ─────────────────────────────────────────────────────────
  async function loginWithEmail(email, password) {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      const result = await signInWithEmail(email, password);
      if (!result.success) { setAuthError(result.error); return; }
      const profile = await getUserProfile(result.user.uid);
      setUser(profile ?? mapFirebaseUser(result.user));
    } catch (err) {
      setAuthError("Unexpected error during sign-in.");
    } finally {
      setIsSigningIn(false);
    }
  }

  // ── Email Sign-Up ─────────────────────────────────────────────────────────
  async function registerWithEmail(email, password, displayName) {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      const result = await signUpWithEmail(email, password, displayName);
      if (!result.success) { setAuthError(result.error); return; }
      const appUser = mapFirebaseUser(result.user);
      await createUserProfile(result.user.uid, appUser);
      setUser(appUser);
    } catch (err) {
      setAuthError("Unexpected error during registration.");
    } finally {
      setIsSigningIn(false);
    }
  }

  // ── Sign Out ──────────────────────────────────────────────────────────────
  async function logoutUser() {
    await signOutUser();
    logout();
  }

  return {
    user, isAuthenticated, authError, isSigningIn,
    loginWithGoogle, loginWithEmail, registerWithEmail, logout: logoutUser,
    clearError: () => setAuthError(null),
  };
}

// ─── useAuthInit ──────────────────────────────────────────────────────────────
/**
 * Bootstraps the Firebase auth listener — call ONCE in AppLayout or App root.
 * Syncs Firebase auth state → Zustand userStore.
 */
export function useAuthInit() {
  const { setUser, logout, setLoading, user: currentUser } = useUserStore();

  useEffect(() => {
    if (!isFirebaseReady()) {
      // No Firebase creds → stay in mock mode with existing persist state
      return;
    }

    setLoading(true);

    // Safety: never leave the app stuck on loading screen longer than 4s
    // (happens if Firestore rules aren't deployed or network is slow)
    const safetyTimeout = setTimeout(() => setLoading(false), 4000);

    const unsubscribe = onAuthChange(async (fbUser) => {
      clearTimeout(safetyTimeout);
      try {
        if (fbUser) {
          // Pull Firestore profile (has IMS scores, rank, etc.)
          const profile = await getUserProfile(fbUser.uid);
          setUser(profile ?? mapFirebaseUser(fbUser));
          // Touch lastActiveAt
          await updateUserProfile(fbUser.uid, {}).catch(() => {});
        } else {
          // Signed out on Firebase side — keep local mock user if present
          if (!currentUser || currentUser.uid.startsWith("demo")) {
            // Already in mock/demo mode — don't clear
          } else {
            logout();
          }
        }
      } catch (err) {
        console.warn("[useAuthInit] Firestore error, continuing in demo mode:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => { clearTimeout(safetyTimeout); unsubscribe(); };

  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
