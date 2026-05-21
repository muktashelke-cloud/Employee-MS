import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, loading } = useContext(AuthContext);

  console.log("👉 USER:", user);
  console.log("👉 ALLOWED ROLES:", allowedRoles);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  // ✅ FIXED ROLE CHECK
  if (
    allowedRoles.length &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;