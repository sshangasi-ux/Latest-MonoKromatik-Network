"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Using sonner for toasts

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const login = () => {
    setIsAuthenticated(true);
    toast.success("Logged in successfully!");
    navigate("/"); // Redirect to home after login
  };

  const logout = () => {
    setIsAuthenticated(false);
    toast.info("You have been logged out.");
    navigate("/logout"); // Redirect to logout page
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};