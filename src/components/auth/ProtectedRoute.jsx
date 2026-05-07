/**
 * ProtectedRoute — For hackathon demo: always renders children.
 * The app uses a built-in demo user (MOCK_USER in userStore) so no login is needed.
 * Firebase auth is still active in the background for score persistence.
 */
export default function ProtectedRoute({ children }) {
  return children;
}
