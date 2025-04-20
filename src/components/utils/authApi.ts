// src/utils/authApi.ts
import { toast } from "sonner";

export interface UserData {
  id: number;
  email: string;
  name: string;
  mobile: string;
  aadhaar?: string;
  balance: number;
  token: string;
}

const API_URL = "http://localhost:8080/api";

export const getCurrentUser = (): UserData | null => {
  const userStr = localStorage.getItem("authUser");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as UserData;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("authUser");
  window.location.href = "/";
};

export const login = async (
  email: string,
  password: string
): Promise<UserData> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const userData = await response.json();
    localStorage.setItem("authUser", JSON.stringify(userData));
    return userData;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    toast.error(message);
    throw error;
  }
};

export const register = async (userData: {
  email: string;
  password: string;
  name: string;
  mobile: string;
  aadhaar?: string;
}): Promise<UserData> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const user = await response.json();
    localStorage.setItem("authUser", JSON.stringify(user));
    return user;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    toast.error(message);
    throw error;
  }
};

// Helper function to make authenticated API calls
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const user = getCurrentUser();

  if (!user || !user.token) {
    toast.error("You are not authenticated");
    logout();
    throw new Error("Not authenticated");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${user.token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // If unauthorized, log out
      if (response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
        throw new Error("Unauthorized");
      }

      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    return await response.json();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "API request failed";
    toast.error(message);
    throw error;
  }
};
