"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  removeAuthToken,
  setAuthToken,
  isTokenValid,
  type User,
} from "@/lib/auth";
import { authApi, ApiError } from "@/lib/api";
import { getAuthToken } from "@/lib/cookies";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch user data from /api/auth/me
  const fetchUserData = async (token?: string): Promise<User | null> => {
    try {
      if (token) {
        setAuthToken(token);
      }

      const userData = await authApi.getMe();
      return userData;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      if (
        error instanceof ApiError &&
        (error.status === 401 || error.status === 403)
      ) {
        removeAuthToken();
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
      return null;
    }
  };

  // Refresh user data (used after login or token change)
  const refreshUser = async () => {
    setIsLoading(true);
    const token = await getAuthToken();
    if (token && isTokenValid(token)) {
      const userData = await fetchUserData();
      setUser(userData);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  };

  // Initialize auth state on mount
  useEffect(() => {
    refreshUser();
  }, []);

  const logout = () => {
    removeAuthToken();
    setUser(null);
    router.push("/login");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
