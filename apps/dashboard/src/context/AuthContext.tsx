"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
}

interface AuthContextType {
  user: User | null;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const { data } = await api.get("/auth/me");
          setUser(data);
        } catch (error) {
          localStorage.removeItem("authToken");
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    checkUserLoggedIn();
  }, []);

  const login = async (data: any) => {
    try {
      const response = await api.post("/auth/login", data);
      localStorage.setItem("authToken", response.data.token);
      const { data: userData } = await api.get("/auth/me");
      setUser(userData);
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed.");
    }
  };

  const register = async (data: any) => {
    try {
      const response = await api.post("/auth/register", data);
      localStorage.setItem("authToken", response.data.token);
      const { data: userData } = await api.get("/auth/me");
      setUser(userData);
      toast.success("Registered successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    router.push("/login");
    toast.success("Logged out.");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
