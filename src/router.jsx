import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppLayout from "@components/layout/AppLayout";
import PageLoader from "@components/common/PageLoader";
import ProtectedRoute from "@components/auth/ProtectedRoute";

// Lazy-loaded pages (core MVP only)
const Dashboard      = lazy(() => import("@pages/Dashboard"));
const CoachingRoom   = lazy(() => import("@pages/CoachingRoom"));
const AIInsights     = lazy(() => import("@pages/AIInsights"));
const Leaderboard    = lazy(() => import("@pages/Leaderboard"));
const UserProfile    = lazy(() => import("@pages/UserProfile"));
const NotFound       = lazy(() => import("@pages/NotFound"));
const LoginScreen    = lazy(() => import("@components/auth/LoginScreen"));

// ─── Wrap a page in Suspense + ProtectedRoute ──────────────────
function Protected({ page: Page }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <Page />
      </Suspense>
    </ProtectedRoute>
  );
}

const router = createBrowserRouter([
  // ── Auth routes (public) ───────────────────────────────────────────────────
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginScreen />
      </Suspense>
    ),
  },

  // ── Protected app shell ────────────────────────────────────────────────────
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,                    element: <Protected page={Dashboard}    /> },
      { path: "coaching-room",          element: <Protected page={CoachingRoom} /> },
      { path: "coaching-room/:matchId", element: <Protected page={CoachingRoom} /> },
      { path: "ai-insights",            element: <Protected page={AIInsights}   /> },
      { path: "leaderboard",            element: <Protected page={Leaderboard}  /> },
      { path: "profile",                element: <Protected page={UserProfile}  /> },
    ],
  },

  // ── 404 ────────────────────────────────────────────────────────────────────
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
