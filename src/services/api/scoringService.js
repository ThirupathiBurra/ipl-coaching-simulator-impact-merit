// ─── Scoring API Service ─────────────────────────────────────────────────────
// Handles communication with FastAPI for IMS scoring and Leaderboards.

import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const scoringApi = {
  /**
   * Submits a user decision to the backend for IMS validation and tracking.
   * @param {Object} decisionPayload
   * @returns {Promise<Object>} Calculated IMS result and sub-scores
   */
  submitDecision: async (decisionPayload) => {
    return apiClient.post(ENDPOINTS.SUBMIT_DECISION, decisionPayload);
  },

  /**
   * Fetches a user's decision history.
   * @param {string} userId
   * @returns {Promise<Array>} List of past decisions
   */
  getHistory: async (userId) => {
    return apiClient.get(ENDPOINTS.MATCH_HISTORY(userId));
  },

  /**
   * Fetches the global leaderboard.
   * @returns {Promise<Array>} Leaderboard entries
   */
  getGlobalLeaderboard: async () => {
    return apiClient.get(ENDPOINTS.LEADERBOARD_GLOBAL);
  },

  /**
   * Fetches the weekly leaderboard.
   * @returns {Promise<Array>} Weekly leaderboard entries
   */
  getWeeklyLeaderboard: async () => {
    return apiClient.get(ENDPOINTS.LEADERBOARD_WEEKLY);
  },
  
  /**
   * Fetches a match-specific leaderboard.
   * @param {string} matchId
   * @returns {Promise<Array>} Match leaderboard entries
   */
  getMatchLeaderboard: async (matchId) => {
    return apiClient.get(ENDPOINTS.LEADERBOARD_MATCH(matchId));
  }
};
