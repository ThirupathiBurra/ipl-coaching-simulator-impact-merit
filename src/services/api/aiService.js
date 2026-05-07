// ─── AI API Service ──────────────────────────────────────────────────────────
// Handles communication with FastAPI for Gemini insights and tactical comparison.

import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const aiApi = {
  /**
   * Fetches general AI insights for a match.
   * @param {string} matchId
   * @returns {Promise<Array>} Array of insights
   */
  getInsights: async (matchId) => {
    return apiClient.get(ENDPOINTS.AI_INSIGHTS(matchId));
  },

  /**
   * Compares the user's decision with the actual captain's decision.
   * @param {Object} payload 
   * @param {Object} payload.userDecision
   * @param {Object} payload.captainDecision
   * @param {Object} payload.matchContext
   * @returns {Promise<Object>} Tactical comparison report
   */
  compareTactics: async (payload) => {
    return apiClient.post(ENDPOINTS.TACTICAL_COMPARISON, payload);
  },

  /**
   * Helper to connect to an SSE endpoint for live AI commentary streaming.
   * Since Axios doesn't support SSE streaming out of the box optimally, 
   * we expose the URL and headers for standard EventSource usage.
   */
  getStreamingCommentaryUrl: () => {
    // Returns the relative URL; EventSource will append to origin.
    // If backend is on a different origin, import.meta.env.VITE_API_BASE_URL is needed.
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
    return `${baseUrl}${ENDPOINTS.AI_COMMENTARY}`;
  }
};
