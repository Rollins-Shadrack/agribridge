"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export interface AppUser {
  id: string;
  email: string;
  name?: string;
  image?: string | null;
  role: "buyer" | "farmer" | "admin";
  is_onboarded: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = async () => {
    try {
      setIsLoading(true);
      const session = await authClient.getSession();
      const sessionUser = session?.data?.user;
      if (!sessionUser?.id) {
        setUser(null);
        return;
      }
      const res = await fetch(`/api/users?id=${sessionUser.id}`);
      const dbUser = await res.json();

      if (!dbUser) {
        setUser(null);
        return;
      }
      const fullUser: AppUser = {
        id: sessionUser.id,
        email: sessionUser.email,
        name: sessionUser.name,
        image: sessionUser.image,
        role: dbUser.role ?? "buyer",
        is_onboarded: dbUser.is_onboarded ?? false,
      };

      setUser(fullUser);
    } catch (err) {
      console.error("Auth error:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const logout = async () => {
    await authClient.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        logout,
        refetch: fetchSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
