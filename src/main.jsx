import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/globals.css";

// ── One-time stale-state purge ──────────────────────────────────────────────
// Clears persisted Zustand state that could have isLoading:true or
// isAuthenticated:false locked in, causing a permanent loading screen.
const CACHE_VERSION = "mvp-v3";
if (localStorage.getItem("_cache_version") !== CACHE_VERSION) {
  localStorage.removeItem("ipl-user-store");
  localStorage.removeItem("ipl-decision-store");
  localStorage.setItem("_cache_version", CACHE_VERSION);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
