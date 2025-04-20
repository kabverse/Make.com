
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

// Check if user is authenticated by checking local storage
const checkIsAuthenticated = (): boolean => {
  const authUser = localStorage.getItem("authUser");
  return !!authUser; // Returns true if authUser exists
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = checkIsAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
