import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

export function ProtectedRoute({ roles }) {
  const location = useLocation();
  const user = authService.current();

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!roles.includes(user.role)) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }
  return <Outlet />;
}
