"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react"; // Import Menu icon
import UserNav from "./UserNav";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; // Import Sheet components

const Header = () => {
  const isAuthenticated = true; // For demonstration, assume user is authenticated
  const [searchTerm, setSearchTerm] = React.useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
          MonoKromatik Network
        </Link>
      </div>

      {/* Desktop Navigation */}
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
        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <Input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
        </form>

        {isAuthenticated ? (
          <UserNav />
        ) : (
          <Button variant="outline" className="hidden md:inline-flex">Login</Button>
        )}

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>MonoKromatik Network</SheetTitle>
                <SheetDescription>
                  Explore the pulse of Africa.
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-lg font-medium hover:text-red-600 transition-colors">
                  Home
                </Link>
                <Link to="/about" className="text-lg font-medium hover:text-red-600 transition-colors">
                  About
                </Link>
                <Link to="/services" className="text-lg font-medium hover:text-red-600 transition-colors">
                  Services
                </Link>
                <Link to="/contact" className="text-lg font-medium hover:text-red-600 transition-colors">
                  Contact
                </Link>
                {/* Mobile Search within the sheet */}
                <form onSubmit={handleSearch} className="relative mt-4">
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="pl-8 pr-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                </form>
                {!isAuthenticated && (
                  <Button asChild className="mt-4">
                    <Link to="/login">Login</Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;