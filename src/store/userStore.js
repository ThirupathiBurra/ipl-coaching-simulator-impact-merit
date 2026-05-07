import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BADGE_CONFIG } from "@data/leaderboardData";

// ─── Badge calculator ──────────────────────────────────────────────────────────
function calcBadge(imsTotal) {
  if (imsTotal >= 9500) return "LEGEND";
  if (imsTotal >= 9000) return "ELITE";
  if (imsTotal >= 8000) return "PRO";
  if (imsTotal >= 7000) return "SKILLED";
  return "AMATEUR";
}

const MOCK_USER = {
  uid:            "demo-user-001",
  displayName:    "Coach Demo",
  email:          "demo@ipl-simulator.com",
  photoURL:       null,
  badge:          "PRO",
  imsTotal:       8731,
  imsRank:        5,
  decisionsCount: 105,
  accuracy:       73,
  streak:         7,
  matchesPlayed:  34,
  joinedAt:       "2025-01-15",
};

export const useUserStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────────
      user:            MOCK_USER,
      isAuthenticated: true,
      isLoading:       false,

      // ── Actions ────────────────────────────────────────────────────────────
      setUser: (user) =>
        set({ user: user ? { ...user, badge: calcBadge(user?.imsTotal ?? 0) } : null, isAuthenticated: !!user }),

      /** Merge-patch fields from Firestore without overwriting auth data */
      syncFromFirestore: (firestoreData) =>
        set((s) => ({
          user: s.user
            ? { ...s.user, ...firestoreData, badge: calcBadge(firestoreData.imsTotal ?? s.user.imsTotal ?? 0) }
            : firestoreData,
        })),

      /** Add delta IMS and update accuracy + badge */
      updateIMS: (delta) =>
        set((s) => {
          const next = (s.user?.imsTotal ?? 0) + delta;
          const decisions = (s.user?.decisionsCount ?? 0) + 1;
          const streak  = delta >= 60 ? (s.user?.streak ?? 0) + 1 : 0;
          return {
            user: {
              ...s.user,
              imsTotal:       next,
              decisionsCount: decisions,
              streak,
              badge:          calcBadge(next),
            },
          };
        }),

      /** Update accuracy % */
      updateAccuracy: (accuracy) =>
        set((s) => ({ user: s.user ? { ...s.user, accuracy } : null })),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({
          user:            null,
          isAuthenticated: false,
          isLoading:       false,
        }),
    }),
    {
      name: "ipl-user-store",
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
);
