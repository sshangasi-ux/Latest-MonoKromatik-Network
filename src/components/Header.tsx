"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleLoginLogout = async () => {
    if (isAuthenticated) {
      await logout();
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="bg-background text-foreground shadow-sm p-4 flex items-center justify-between border-b border-border sticky top-0 z-50">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-heading font-extrabold uppercase text-foreground">
          MONO<span className="text-primary">[KROMATIK]</span> NETWORK
        </Link>
      </div>
      <nav className="hidden md:flex space-x-6">
        <Link to="/" className="text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm">
          Home
        </Link>
        <Link to="/shows" className="text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm">
          Shows
        </Link>
        <Link to="/news" className="text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm">
          News
        </Link>
        <Link to="/music" className="text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm">
          Music
        </Link>
        <Link to="/watch" className="text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm">
          Watch
        </Link>
        <Link to="/shop" className="text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm">
          Shop
        </Link>
      </nav>
      <div className="flex items-center space-x-4">
        <form onSubmit={handleSearch} className="flex">
          <Input
            type="text"
            placeholder="SEARCH CONTENT..."
            className="w-48 bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground uppercase text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="ghost" size="icon" className="ml-2 text-muted-foreground hover:bg-secondary hover:text-primary">
            <Search className="h-5 w-5" />
          </Button>
        </form>
        {isAuthenticated ? (
          <Button asChild variant="ghost" size="icon" className="text-foreground hover:bg-secondary hover:text-primary">
            <Link to="/profile">
              <User className="h-6 w-6" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" onClick={handleLoginLogout} className="hidden md:inline-flex border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase font-semibold text-sm px-4 py-2">
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;