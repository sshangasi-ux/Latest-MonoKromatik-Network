"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react"; // Import Heart icon

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
          MonoKromatik Network
        </Link>
      </div>
      <nav className="hidden md:flex space-x-6">
        <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
          Home
        </Link>
        <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
          About
        </Link>
        <Link to="/services" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
          Services
        </Link>
        <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
          Contact
        </Link>
        <Link to="/watchlist" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center">
          <Heart className="h-4 w-4 mr-1" /> Watchlist
        </Link>
      </nav>
      <div className="flex items-center space-x-4">
        <Button variant="outline" className="hidden md:inline-flex">Login</Button>
        {/* Mobile menu icon could go here later */}
      </div>
    </header>
  );
};

export default Header;