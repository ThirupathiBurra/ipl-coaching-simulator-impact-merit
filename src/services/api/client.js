// ─── Core Axios Client ────────────────────────────────────────────────────────
// Pre-configured Axios instance with Firebase Auth injection, automatic retries,
// and standardized error handling.

import axios from "axios";
import { auth } from "@services/firebase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const MAX_RETRIES = 3;

// Create the Axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor: Attach Auth Token ──────────────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    // Attempt to get the current Firebase user token
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (err) {
        console.warn("[API Client] Failed to get Firebase ID token:", err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Error Handling & Retries ─────────────────────────
apiClient.interceptors.response.use(
  (response) => response.data, // Unwrap data on success
  async (error) => {
    const { config, response } = error;
    
    // Setup retry state on the config object
    config.__retryCount = config.__retryCount || 0;

    // Retry Logic: Only retry idempotent methods (GET) on 5xx or Network Errors
    const isGet = config.method?.toLowerCase() === "get";
    const isNetworkError = !response;
    const isServerError = response && response.status >= 500;

    if (isGet && (isNetworkError || isServerError) && config.__retryCount < MAX_RETRIES) {
      config.__retryCount += 1;
      
      // Exponential backoff: 500ms, 1000ms, 2000ms
      const backoffTime = Math.pow(2, config.__retryCount - 1) * 500;
      console.warn(`[API Client] Retry ${config.__retryCount}/${MAX_RETRIES} for ${config.url} in ${backoffTime}ms`);
      
      await new Promise((resolve) => setTimeout(resolve, backoffTime));
      
      // Retain the axios instance context to re-trigger interceptors if needed
      return apiClient(config);
    }

    // Standardize error payload
    const customError = new Error(
      response?.data?.detail || response?.data?.message || error.message || "An unexpected error occurred"
    );
    customError.status = response?.status || null;
    customError.code = error.code;
    customError.originalError = error;

    if (customError.status === 401) {
      console.error("[API Client] Unauthorized request. Token might be invalid or expired.");
      // Optional: Dispatch a global event to force logout in userStore
      // window.dispatchEvent(new Event('api:unauthorized'));
    }

    return Promise.reject(customError);
  }
);
