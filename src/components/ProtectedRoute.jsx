import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// 'children' represents whatever page this guard is wrapping
function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth(); // Ask the bucket: "Who is this?"

  // Rule 1: If they aren't logged in at all, kick them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Rule 2: If this page requires Admin rights, and they aren't an admin, kick them home
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If they pass all the security checks, let them see the page!
  return children;
}

export default ProtectedRoute;