'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from './types';
import { mockUsers } from './data/users';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  loginAs: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from localStorage
  useEffect(() => {
    const savedUserId = localStorage.getItem('agribridge_user_id');
    if (savedUserId) {
      const foundUser = mockUsers.find(u => u.id === savedUserId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('agribridge_user_id');
    setUser(null);
  };

  const loginAs = (userId: string) => {
    const foundUser = mockUsers.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('agribridge_user_id', userId);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, loginAs }}>
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
