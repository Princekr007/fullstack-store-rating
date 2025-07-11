import { Navigate } from "react-router-dom";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // No token = redirect to login
    return <Navigate to="/login" replace />;
  }

  // Decode JWT to get role
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const userRole = decodedToken.role;

  if (!allowedRoles.includes(userRole)) {
    // Not allowed for this role
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
