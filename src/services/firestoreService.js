// ─── Firestore Service Layer ──────────────────────────────────────────────────
// All Firestore operations organized by collection.
// Every function is guarded by isFirebaseReady() and returns safe fallbacks.

import {
  doc, getDoc, setDoc, updateDoc, addDoc, getDocs, deleteDoc,
  collection, query, where, orderBy, limit as firestoreLimit,
  onSnapshot, serverTimestamp, increment, arrayUnion,
} from "firebase/firestore";
import { db, isFirebaseReady } from "./firebase";

// ─── Collection paths ─────────────────────────────────────────────────────────
const COL = {
  users:             "users",
  decisions:         "coaching_decisions",
  impactScores:      "impact_scores",
  leaderboards:      "leaderboards",
  liveMatches:       "live_matches",
  aiInsights:        "ai_insights",
};

// ─── Helper: safe Firestore call ──────────────────────────────────────────────
async function safe(fn, fallback = null) {
  if (!isFirebaseReady()) return fallback;
  try { return await fn(); }
  catch (err) { console.error("[Firestore]", err.message); return fallback; }
}

// ══════════════════════════════════════════════════════════════════════════════
// USERS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Create a user profile if it doesn't exist (called on first sign-in).
 */
export async function createUserProfile(uid, data) {
  return safe(async () => {
    const ref = doc(db, COL.users, uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid,
        ...data,
        imsTotal:       0,
        imsRank:        null,
        decisionsCount: 0,
        accuracy:       0,
        streak:         0,
        matchesPlayed:  0,
        badge:          "AMATEUR",
        createdAt:      serverTimestamp(),
        lastActiveAt:   serverTimestamp(),
      });
    }
    return true;
  });
}

/**
 * Fetch a user's profile from Firestore.
 */
export async function getUserProfile(uid) {
  return safe(async () => {
    const snap = await getDoc(doc(db, COL.users, uid));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  });
}

/**
 * Merge-patch a user profile.
 */
export async function updateUserProfile(uid, patch) {
  return safe(() =>
    updateDoc(doc(db, COL.users, uid), { ...patch, lastActiveAt: serverTimestamp() })
  );
}

/**
 * Create-or-update a user profile (safe upsert).
 */
export async function upsertUserProfile(uid, data) {
  return safe(() =>
    setDoc(doc(db, COL.users, uid), { ...data, lastActiveAt: serverTimestamp() }, { merge: true })
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// COACHING DECISIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Persist a coaching decision to Firestore.
 */
export async function saveDecision(uid, decision) {
  return safe(() =>
    addDoc(collection(db, COL.decisions), {
      uid,
      ...decision,
      createdAt: serverTimestamp(),
    })
  );
}

/**
 * Get a user's recent decisions (newest first).
 */
export async function getUserDecisions(uid, limitN = 20) {
  return safe(async () => {
    const q = query(
      collection(db, COL.decisions),
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
      firestoreLimit(limitN)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }, []);
}

// ══════════════════════════════════════════════════════════════════════════════
// IMPACT SCORES
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Append an IMS score record for a user.
 */
export async function saveIMSScore(uid, scoreData) {
  return safe(() =>
    addDoc(collection(db, COL.impactScores), {
      uid,
      ...scoreData,
      createdAt: serverTimestamp(),
    })
  );
}

/**
 * Get IMS score history for a user.
 */
export async function getUserIMSHistory(uid, limitN = 30) {
  return safe(async () => {
    const q = query(
      collection(db, COL.impactScores),
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
      firestoreLimit(limitN)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }, []);
}

// ══════════════════════════════════════════════════════════════════════════════
// LEADERBOARDS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Update (upsert) a user's leaderboard entry.
 */
export async function updateLeaderboardEntry(uid, data) {
  return safe(() =>
    setDoc(
      doc(db, COL.leaderboards, uid),
      { uid, ...data, updatedAt: serverTimestamp() },
      { merge: true }
    )
  );
}

/**
 * Fetch the global leaderboard (ordered by imsTotal desc).
 */
export async function getLeaderboard(limitN = 50) {
  return safe(async () => {
    const q = query(
      collection(db, COL.leaderboards),
      orderBy("imsTotal", "desc"),
      firestoreLimit(limitN)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() }));
  }, []);
}

/**
 * Subscribe to real-time leaderboard updates.
 * @returns {function} Unsubscribe function
 */
export function subscribeLeaderboard(callback, limitN = 50) {
  if (!isFirebaseReady()) return () => {};
  const q = query(
    collection(db, COL.leaderboards),
    orderBy("imsTotal", "desc"),
    firestoreLimit(limitN)
  );
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() }));
    callback(data);
  }, (err) => console.error("[Firestore] Leaderboard subscription error:", err));
}

// ══════════════════════════════════════════════════════════════════════════════
// LIVE MATCHES
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Subscribe to real-time live match updates.
 * @param {string} matchId - Firestore document ID for the match
 * @param {function} callback - Called with match data on every update
 * @returns {function} Unsubscribe function
 */
export function subscribeToMatch(matchId, callback) {
  if (!isFirebaseReady()) return () => {};
  return onSnapshot(
    doc(db, COL.liveMatches, matchId),
    (snap) => {
      if (snap.exists()) callback({ id: snap.id, ...snap.data() });
    },
    (err) => console.error("[Firestore] Match subscription error:", err)
  );
}

/**
 * Write/update a match document (admin / simulation use only).
 */
export async function updateMatchState(matchId, data) {
  return safe(() =>
    setDoc(doc(db, COL.liveMatches, matchId), { ...data, updatedAt: serverTimestamp() }, { merge: true })
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AI INSIGHTS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Save a Gemini-generated insight associated with a match.
 */
export async function saveInsight(matchId, insight) {
  return safe(() =>
    addDoc(collection(db, COL.aiInsights), {
      matchId,
      ...insight,
      createdAt: serverTimestamp(),
    })
  );
}

/**
 * Fetch AI insights for a specific match.
 */
export async function getMatchInsights(matchId, limitN = 10) {
  return safe(async () => {
    const q = query(
      collection(db, COL.aiInsights),
      where("matchId", "==", matchId),
      orderBy("createdAt", "desc"),
      firestoreLimit(limitN)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }, []);
}
