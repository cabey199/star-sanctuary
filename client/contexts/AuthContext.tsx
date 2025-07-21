import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthSession } from "../../shared/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (permission: keyof User["permissions"]) => boolean;
  isMotherAdmin: () => boolean;
  isSubadmin: () => boolean;
}

interface ClientAuthContextType {
  clientUser: any | null;
  isClientAuthenticated: boolean;
  isClientLoading: boolean;
  clientLogin: (
    clientName: string,
    username: string,
    password: string,
  ) => Promise<boolean>;
  clientLogout: () => void;
  hasClientPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ClientAuthContext = createContext<ClientAuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token on mount
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse user data:", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success && result.user) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user);
        return true;
      }

      return false;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const hasPermission = (permission: keyof User["permissions"]): boolean => {
    return user?.permissions[permission] || false;
  };

  const isMotherAdmin = (): boolean => {
    return user?.role === "mother_admin";
  };

  const isSubadmin = (): boolean => {
    return user?.role === "subadmin";
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    hasPermission,
    isMotherAdmin,
    isSubadmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function ClientAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [clientUser, setClientUser] = useState<any | null>(null);
  const [isClientLoading, setIsClientLoading] = useState(true);

  useEffect(() => {
    // Check for existing client auth token on mount
    const token = localStorage.getItem("clientAuthToken");
    const userData = localStorage.getItem("clientUser");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setClientUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse client user data:", err);
        localStorage.removeItem("clientAuthToken");
        localStorage.removeItem("clientUser");
      }
    }

    setIsClientLoading(false);
  }, []);

  const clientLogin = async (
    clientName: string,
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/auth/client-login/${clientName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success && result.client) {
        localStorage.setItem("clientAuthToken", result.token);
        localStorage.setItem("clientUser", JSON.stringify(result.client));
        setClientUser(result.client);
        return true;
      }

      return false;
    } catch (err) {
      console.error("Client login error:", err);
      return false;
    }
  };

  const clientLogout = () => {
    localStorage.removeItem("clientAuthToken");
    localStorage.removeItem("clientUser");
    setClientUser(null);
  };

  const hasClientPermission = (permission: string): boolean => {
    return clientUser?.permissions?.[permission] || false;
  };

  const value: ClientAuthContextType = {
    clientUser,
    isClientAuthenticated: !!clientUser,
    isClientLoading,
    clientLogin,
    clientLogout,
    hasClientPermission,
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider");
  }
  return context;
}

// Protected Route Components
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You need to be logged in to access this page.
          </p>
          <a
            href="/login"
            className="text-primary hover:text-primary/80 underline"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function ClientProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isClientAuthenticated, isClientLoading } = useClientAuth();

  if (isClientLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isClientAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You need to be logged in to access this dashboard.
          </p>
          <a
            href={`${window.location.pathname}/login`}
            className="text-primary hover:text-primary/80 underline"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
