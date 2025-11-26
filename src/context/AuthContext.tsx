"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase, updateUserPreferredCategories as supabaseUpdateUserPreferredCategories, fetchUserSubscription, UserSubscription } from "@/lib/supabase"; // Import fetchUserSubscription and UserSubscription
import { User } from "@supabase/supabase-js";

// Extend the User type to include preferred_categories in user_metadata
interface CustomUser extends User {
  user_metadata: User['user_metadata'] & {
    preferred_categories?: string[];
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: CustomUser | null;
  userSubscription: UserSubscription | null; // New: User's subscription details
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  updateUserProfile: (fullName: string, avatarUrl: string | null) => Promise<void>;
  updateUserEmail: (newEmail: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  updateUserPreferredCategories: (categories: string[]) => Promise<void>;
  refreshSubscription: () => Promise<void>; // New: Function to manually refresh subscription status
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<CustomUser | null>(null);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null); // New state
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modified refreshSubscription to use the user from state
  const refreshSubscription = async () => {
    if (user?.id) { // Use user.id from the state
      try {
        const subscription = await fetchUserSubscription(user.id);
        setUserSubscription(subscription);
      } catch (err) {
        console.error("Failed to fetch user subscription:", err);
        setUserSubscription(null);
      }
    } else {
      setUserSubscription(null);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setIsAuthenticated(true);
          setUser(session.user as CustomUser); // Cast to CustomUser
          // Call refreshSubscription with the new user ID
          try {
            const subscription = await fetchUserSubscription(session.user.id);
            setUserSubscription(subscription);
          } catch (err) {
            console.error("Failed to fetch user subscription:", err);
            setUserSubscription(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setUserSubscription(null); // Clear subscription on logout
        }
        setLoading(false);
      }
    );

    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setUser(session.user as CustomUser); // Cast to CustomUser
        // Call refreshSubscription with the initial user ID
        try {
          const subscription = await fetchUserSubscription(session.user.id);
          setUserSubscription(subscription);
        } catch (err) {
          console.error("Failed to fetch user subscription:", err);
          setUserSubscription(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUserSubscription(null);
      }
      setLoading(false);
    };

    getInitialSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Removed user from dependency array to prevent infinite loop with refreshSubscription

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      throw error;
    } else {
      toast.success("Logged in successfully!");
      navigate("/");
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      throw error;
    } else if (data.user) {
      toast.success("Account created successfully! Please check your email to verify your account.");
      navigate("/login");
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      throw error;
    } else {
      toast.info("You have been logged out.");
      navigate("/logout");
    }
  };

  const updateUserProfile = async (fullName: string, avatarUrl: string | null) => {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        avatar_url: avatarUrl,
      },
    });

    if (error) {
      throw error;
    }
    if (data.user) {
      setUser(data.user as CustomUser); // Cast to CustomUser
    }
  };

  const updateUserEmail = async (newEmail: string) => {
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      throw error;
    }
    if (data.user) {
      setUser(data.user as CustomUser); // Cast to CustomUser
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      throw error;
    }
    if (data.user) {
      setUser(data.user as CustomUser); // Cast to CustomUser
    }
  };

  const updateUserPreferredCategories = async (categories: string[]) => {
    try {
      const updatedUser = await supabaseUpdateUserPreferredCategories(categories);
      if (updatedUser) {
        setUser(updatedUser as CustomUser); // Update local user state
        toast.success("Preferred categories updated!");
      }
    } catch (error: any) {
      toast.error(`Failed to update preferences: ${error.message}`);
      throw error;
    }
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userSubscription, login, logout, signup, updateUserProfile, updateUserEmail, updateUserPassword, updateUserPreferredCategories, refreshSubscription }}>
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