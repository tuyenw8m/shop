"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  avatar_url?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.roles?.includes("ADMIN") || false;

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const userData = localStorage.getItem("admin_user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.roles?.includes("ADMIN")) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);

      if (response.data?.status === 0) {
        const { token, user: userData } = response.data.data;

        if (!userData.roles?.includes("ADMIN")) {
          throw new Error("Bạn không có quyền truy cập vào trang quản trị");
        }

        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_user", JSON.stringify(userData));
        setUser(userData);
      } else {
        throw new Error(response.data?.message || "Đăng nhập thất bại");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(
        error.response?.data?.message || error.message || "Đăng nhập thất bại"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth Lỗi khi xác thực, thử lại !");
  }
  return context;
}
