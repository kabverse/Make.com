import React, { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const API_URL = "http://localhost:8080/api/user/validate";

// Check if user is authenticated and token is valid
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authUserStr = localStorage.getItem("authUser");

      if (!authUserStr) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const authUser = JSON.parse(authUserStr);

        // In a more complete implementation, we would verify the token with the backend
        // For now, we'll consider having a token in localStorage as authenticated
        if (authUser && authUser.token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return isAuthenticated;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuth();

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
