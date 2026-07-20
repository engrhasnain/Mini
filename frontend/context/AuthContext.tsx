"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import { User, AuthResponse } from "@/types";
import { authApi } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (data: AuthResponse) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ─── Check auth status on mount ────────────────────────────────────────────
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get("access_token");
    const storedUser = Cookies.get("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        logout();
      }
    }
    setLoading(false);
  };

  // ─── Login ──────────────────────────────────────────────────────────────────
  const login = async (data: AuthResponse) => {
    const { access_token, user } = data;
    
    // Save token to cookie (7 days)
    Cookies.set("access_token", access_token, { expires: 7 });
    
    // Save user to cookie (7 days)
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
    
    // Set state
    setUser(user);
  };

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("user");
    setUser(null);
  };

  // ─── Computed Values ────────────────────────────────────────────────────────
  const isAuthenticated = !!user;
  const isAdmin = user?.is_admin ?? false;

  // ─── Value ──────────────────────────────────────────────────────────────────
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}