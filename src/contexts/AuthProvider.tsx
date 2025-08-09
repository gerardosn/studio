
"use client";

import React, { createContext, useState, useContext, useEffect, type ReactNode, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoaded: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'authToken';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to access localStorage", error);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  const login = useCallback((token: string) => {
    try {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to save token to localStorage", error);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Failed to remove token from localStorage", error);
    }
  }, []);

  const value = { isAuthenticated, isLoaded, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
