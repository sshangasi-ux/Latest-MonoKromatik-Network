"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <header className="bg-background text-foreground shadow-sm p-4 flex items-center justify-between border-b border-border">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-primary-foreground">
          MonoKromatik Network
        </Link>
      </div>
      <nav className="hidden md:flex space-x-6">
        <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
          Home
        </Link>
        <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
          About
        </Link>
        <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
          Services
        </Link>
        <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
          Contact
        </Link>
      </nav>
      <div className="flex items-center space-x-4">
        <form onSubmit={handleSearch} className="flex">
          <Input
            type="text"
            placeholder="Search content..."
            className="w-48 bg-secondary border-border text-foreground focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="ghost" size="icon" className="ml-2 text-muted-foreground hover:bg-secondary hover:text-primary">
            <Search className="h-5 w-5" />
          </Button>
        </form>
        <Button variant="outline" className="hidden md:inline-flex border-primary text-primary hover:bg-primary hover:text-primary-foreground">Login</Button>
        {/* Mobile menu icon could go here later */}
      </div>
    </header>
  );
};

export default Header;