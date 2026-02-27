'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '@/lib/api/axiosInstance';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bugbaar_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          localStorage.removeItem('bugbaar_user');
        }
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bugbaar_user', JSON.stringify(userData));
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      // Ignore logout endpoint errors
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bugbaar_user');
        window.location.href = '/login';
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
