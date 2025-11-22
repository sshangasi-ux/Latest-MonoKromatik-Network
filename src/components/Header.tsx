"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Search } from "lucide-react"; // Re-added Search icon
import UserNav from "./UserNav";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import SearchDialog from "./SearchDialog"; // New import

const Header = () => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  // Removed isSearchOpen state as search is now handled by SearchDialog
  const navigate = useNavigate();

  // Removed handleSearch as search is now handled by SearchDialog or SearchResults page
  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      // No need to close search bar here, as it's part of the mobile sheet
    }
  };

  return (
    <header className="bg-black text-white shadow-sm p-4 flex items-center justify-between relative z-50">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-extrabold uppercase text-red-600 hover:text-red-500">
          MonoKromatik
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-6">
        <Link to="/" className="text-gray-300 hover:text-red-500 transition-colors font-medium">
          Home
        </Link>
        <Link to="/shows" className="text-gray-300 hover:text-red-500 transition-colors font-medium">
          Shows
        </Link>
        <Link to="/articles" className="text-gray-300 hover:text-red-500 transition-colors font-medium">
          Articles
        </Link>
        <Link to="/videos" className="text-gray-300 hover:text-red-500 transition-colors font-medium">
          Videos
        </Link>
        <Link to="/categories" className="text-gray-300 hover:text-red-500 transition-colors font-medium">
          Categories
        </Link>
        <Link to="/about" className="text-gray-300 hover:text-red-500 transition-colors font-medium">
          About
        </Link>
        <Link to="/contact" className="text-gray-300 hover:text-red-500 transition-colors font-medium">
          Contact
        </Link>
      </nav>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Desktop Search Dialog Trigger */}
        <div className="hidden md:block">
          <SearchDialog />
        </div>

        <ThemeToggle />

        {isAuthenticated ? (
          <UserNav />
        ) : (
          <Button asChild variant="outline" className="hidden md:inline-flex border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
            <Link to="/login">Login</Link>
          </Button>
        )}

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black text-white border-neutral-800">
              <SheetHeader>
                <SheetTitle className="text-2xl font-extrabold uppercase text-red-600">MonoKromatik</SheetTitle>
                <SheetDescription className="text-gray-400">
                  Explore the pulse of Africa.
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-lg font-medium hover:text-red-500 transition-colors">
                  Home
                </Link>
                <Link to="/shows" className="text-lg font-medium hover:text-red-500 transition-colors">
                  Shows
                </Link>
                <Link to="/articles" className="text-lg font-medium hover:text-red-500 transition-colors">
                  Articles
                </Link>
                <Link to="/videos" className="text-lg font-medium hover:text-red-500 transition-colors">
                  Videos
                </Link>
                <Link to="/categories" className="text-lg font-medium hover:text-red-500 transition-colors">
                  Categories
                </Link>
                <Link to="/about" className="text-lg font-medium hover:text-red-500 transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-lg font-medium hover:text-red-500 transition-colors">
                  Contact
                </Link>
                {/* Mobile Search within the sheet - kept for mobile consistency */}
                <form onSubmit={handleMobileSearch} className="relative mt-4">
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="pl-3 pr-8 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 bg-transparent hover:bg-neutral-700 text-gray-300">
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Submit Search</span>
                  </Button>
                </form>
                <ThemeToggle />
                {!isAuthenticated && (
                  <Button asChild className="mt-4 bg-red-600 hover:bg-red-700 text-white">
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