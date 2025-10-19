"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, setAccessToken, removeAccessToken } from "../utils/auth.client";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const router = useRouter();
  const isAuthenticated = !!token;

  // Check localStorage voor opgeslagen token bij mount
  useEffect(() => {
    const stored = getAccessToken();
    if (stored) setToken(stored);
    setIsAuthReady(true); // ✅ CRITICAL FIX: Mark als klaar na check
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password }).toString(),
      });

      if (!response.ok) {
        console.error("Login failed:", response.statusText);
        return false;
      }

      const data: LoginResponse = await response.json();
      setAccessToken(data.access_token);
      setToken(data.access_token);

      router.refresh();
      return true;
    } catch (err) {
      console.error("Network/parsing error during login:", err);
      return false;
    }
  };

  const logout = () => {
    removeAccessToken();
    setToken(null);
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, isAuthReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};