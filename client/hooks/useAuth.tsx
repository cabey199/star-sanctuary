import { useState, useEffect } from "react";
import { User } from "../../shared/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isMotherAdmin: boolean;
  isSubadmin: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData) as User;
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse user data:", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  const isAuthenticated = !!user;
  const isMotherAdmin = user?.role === "mother_admin";
  const isSubadmin = user?.role === "subadmin";

  return {
    user,
    isAuthenticated,
    isLoading,
    isMotherAdmin,
    isSubadmin,
  };
}

export function login(username: string, password: string): Promise<boolean> {
  return fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success && result.user) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        // Trigger a page reload to update the auth state
        window.location.reload();
        return true;
      }
      return false;
    })
    .catch(() => false);
}

export function logout(): void {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  window.location.href = "/";
}
