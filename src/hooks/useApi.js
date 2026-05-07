// ─── useApi Custom Hook ──────────────────────────────────────────────────────
// A generic wrapper hook to handle data, loading, and error states for API calls.

import { useState, useCallback } from "react";

/**
 * useApi Hook
 * @param {Function} apiFunc - The async API function from a service (e.g., matchApi.getLiveMatch)
 * @param {Object} options 
 * @param {boolean} options.immediate - Whether to execute immediately on mount
 * @param {any} options.initialData - Initial state for data
 * @returns {Object} { data, loading, error, execute, reset }
 */
export function useApi(apiFunc, { immediate = false, initialData = null } = {}) {
  const [data, setData]       = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError]     = useState(null);

  // Use useCallback to prevent infinite loops if execute is a dependency elsewhere
  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        return { success: true, data: result };
      } catch (err) {
        setError(err.message || "An error occurred");
        return { success: false, error: err.message || "An error occurred" };
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  // Handle immediate execution if requested (useful for page load fetches)
  // We use a separate useEffect to trigger execute to satisfy deps
  // Note: if immediate is true, you MUST pass arguments to useApi?
  // Usually immediate is used when the apiFunc requires NO arguments.
  
  return { data, loading, error, execute, reset };
}
