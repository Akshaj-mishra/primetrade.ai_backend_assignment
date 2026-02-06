import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("user" | "admin")[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

 
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Access Denied</h1>
        <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }

  return <>{children}</>;
}