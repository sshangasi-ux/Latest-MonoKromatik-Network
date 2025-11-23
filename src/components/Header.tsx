"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import Input component
import { Search } from "lucide-react"; // Import Search icon

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(""); // Clear search term after navigating
    }
  };

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
      </nav>
      <div className="flex items-center space-x-4">
        <form onSubmit={handleSearch} className="flex">
          <Input
            type="text"
            placeholder="Search content..."
            className="w-48 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-red-600 focus:border-red-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="ghost" size="icon" className="ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Search className="h-5 w-5" />
          </Button>
        </form>
        <Button variant="outline" className="hidden md:inline-flex">Login</Button>
        {/* Mobile menu icon could go here later */}
      </div>
    </header>
  );
};

export default Header;