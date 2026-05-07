// ─── API Endpoints ────────────────────────────────────────────────────────────
// Centralized endpoint definitions for the FastAPI backend.

export const ENDPOINTS = {
  // Matches
  LIVE_MATCH: (matchId) => `/matches/live/${matchId}`,
  MATCH_ANALYTICS: (matchId) => `/matches/${matchId}/analytics`,
  
  // AI & Tactical
  AI_INSIGHTS: (matchId) => `/ai/insights/${matchId}`,
  TACTICAL_COMPARISON: `/ai/tactical-comparison`,
  AI_COMMENTARY: `/ai/commentary/stream`, // Used for SSE streaming

  // Scoring & Decisions
  SUBMIT_DECISION: `/scoring/decision`,
  MATCH_HISTORY: (userId) => `/scoring/history/${userId}`,
  
  // Leaderboard
  LEADERBOARD_GLOBAL: `/leaderboard/global`,
  LEADERBOARD_WEEKLY: `/leaderboard/weekly`,
  LEADERBOARD_MATCH: (matchId) => `/leaderboard/match/${matchId}`,
};
