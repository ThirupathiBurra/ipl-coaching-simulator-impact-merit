// ─── Firestore Custom Hooks ────────────────────────────────────────────────────
// Each hook wraps a firestoreService call with loading/error state.
// All safely no-op when Firebase is not configured.

import { useState, useEffect, useRef } from "react";
import {
  getUserProfile,
  getUserDecisions,
  getUserIMSHistory,
  subscribeLeaderboard,
  subscribeToMatch,
} from "@services/firestoreService";
import { isFirebaseReady } from "@services/firebase";

// ─── useUserProfile ───────────────────────────────────────────────────────────
/**
 * Fetch a user's Firestore profile. Re-fetches when uid changes.
 */
export function useUserProfile(uid) {
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState(null);

  useEffect(() => {
    if (!uid || !isFirebaseReady()) return;
    setLoading(true);
    getUserProfile(uid)
      .then((data) => { setProfile(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(()  => setLoading(false));
  }, [uid]);

  return { profile, loading, error };
}

// ─── useDecisionHistory ───────────────────────────────────────────────────────
/**
 * Fetch paginated coaching decisions for a user from Firestore.
 */
export function useDecisionHistory(uid, limitN = 20) {
  const [decisions, setDecisions] = useState([]);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    if (!uid || !isFirebaseReady()) return;
    setLoading(true);
    getUserDecisions(uid, limitN)
      .then(setDecisions)
      .finally(() => setLoading(false));
  }, [uid, limitN]);

  return { decisions, loading };
}

// ─── useIMSHistory ────────────────────────────────────────────────────────────
/**
 * Fetch IMS score history for a user from Firestore.
 */
export function useIMSHistory(uid, limitN = 30) {
  const [history,  setHistory]  = useState([]);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (!uid || !isFirebaseReady()) return;
    setLoading(true);
    getUserIMSHistory(uid, limitN)
      .then(setHistory)
      .finally(() => setLoading(false));
  }, [uid, limitN]);

  return { history, loading };
}

// ─── useLeaderboard ───────────────────────────────────────────────────────────
/**
 * Real-time Firestore leaderboard subscription.
 * Falls back to static mock data when Firebase is not configured.
 */
export function useLeaderboard(limitN = 50) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseReady()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeLeaderboard((entries) => {
      setData(entries);
      setLoading(false);
    }, limitN);
    return () => unsub();
  }, [limitN]);

  return { data, loading };
}

// ─── useLiveMatch ─────────────────────────────────────────────────────────────
/**
 * Real-time subscription to a Firestore live match document.
 * When Firebase is ready, live updates flow into matchStore automatically.
 * Without Firebase, the app uses MOCK_LIVE_MATCH from matchStore.
 */
export function useLiveMatch(matchId, onUpdate) {
  const [connected, setConnected] = useState(false);
  const unsubRef = useRef(null);

  useEffect(() => {
    if (!matchId || !isFirebaseReady()) return;

    setConnected(false);
    unsubRef.current = subscribeToMatch(matchId, (matchData) => {
      setConnected(true);
      onUpdate?.(matchData);
    });

    return () => {
      unsubRef.current?.();
      setConnected(false);
    };
  }, [matchId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { connected };
}
