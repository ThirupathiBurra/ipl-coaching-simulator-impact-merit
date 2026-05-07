// ─── Match API Service ───────────────────────────────────────────────────────
// Handles communication with FastAPI for live match and analytics endpoints.

import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const matchApi = {
  /**
   * Fetches the current live match state.
   * @param {string} matchId
   * @returns {Promise<Object>} Match data
   */
  getLiveMatch: async (matchId) => {
    return apiClient.get(ENDPOINTS.LIVE_MATCH(matchId));
  },

  /**
   * Fetches deep analytics for a specific match.
   * @param {string} matchId
   * @returns {Promise<Object>} Analytics data
   */
  getMatchAnalytics: async (matchId) => {
    return apiClient.get(ENDPOINTS.MATCH_ANALYTICS(matchId));
  },
};
