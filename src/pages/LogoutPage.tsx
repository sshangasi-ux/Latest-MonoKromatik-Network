"use client";

import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

const LogoutPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged out, redirect to home
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-heading font-bold uppercase tracking-tight">Logged Out</h1>
          <p className="text-xl text-muted-foreground font-sans">
            You have been successfully logged out.
          </p>
          <p className="text-muted-foreground font-sans">
            Redirecting to homepage in 3 seconds...
          </p>
          <Link to="/" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
            Return to Home Immediately
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LogoutPage;