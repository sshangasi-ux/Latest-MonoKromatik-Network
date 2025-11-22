"use client";

import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // Automatically log out when this page is accessed directly,
    // or if the user navigates here.
    // The logout function already handles navigation and toast.
    // We can also add a button to explicitly log out if they landed here without doing so.
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto p-8 text-center flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 text-white">Logged Out</h1>
        <p className="text-xl text-gray-300 mb-6">
          You have been successfully logged out.
        </p>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
          <Link to="/login">Login Again</Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
};

export default Logout;