import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

export function ProtectedRoute({ roles }) {
  const location = useLocation();
  const user = authService.current();

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  const isAdmin = ["admin", "super_admin"].includes(user.role);
  if (!roles.includes(user.role)) {
    return <Navigate to={isAdmin ? "/admin/service-health" : "/dashboard"} replace />;
  }
  return <Outlet />;
}
