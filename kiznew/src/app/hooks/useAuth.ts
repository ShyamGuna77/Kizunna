// hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log("Loaded user data:", userData);
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const updateUser = useCallback((userData: User | null) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const clearUser = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    updateUser,
    clearUser,
    refreshUser: loadUser,
  };
}
