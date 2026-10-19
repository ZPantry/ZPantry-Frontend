import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

export function ProtectedRoute({ roles }) {
  const location = useLocation();
  const user = authService.current();

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  const role = user.role?.toLowerCase();
  const isAdmin = ["admin", "super_admin"].includes(role);
  if (!roles.includes(role)) {
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  }
  return <Outlet />;
}
