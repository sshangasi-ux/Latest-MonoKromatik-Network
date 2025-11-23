"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Heart, ListMusic, GraduationCap, Menu } from "lucide-react"; // Import Menu icon
import { useAuth } from "@/context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile"; // Import useIsMobile hook

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false); // State to control sheet open/close
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const isMobile = useIsMobile(); // Use the hook to detect mobile

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      if (isMobile) setIsSheetOpen(false); // Close sheet after search on mobile
    }
  };

  const handleLoginLogout = async () => {
    if (isAuthenticated) {
      await logout();
    } else {
      navigate("/login");
    }
    if (isMobile) setIsSheetOpen(false); // Close sheet after action on mobile
  };

  const handleNavLinkClick = () => {
    if (isMobile) setIsSheetOpen(false); // Close sheet when a nav link is clicked
  };

  const navLinks = (
    <>
      <Link to="/" className="block py-2 text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm" onClick={handleNavLinkClick}>
        Home
      </Link>
      <Link to="/shows" className="block py-2 text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm" onClick={handleNavLinkClick}>
        Shows
      </Link>
      <Link to="/news" className="block py-2 text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm" onClick={handleNavLinkClick}>
        News
      </Link>
      <Link to="/music" className="block py-2 text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm" onClick={handleNavLinkClick}>
        Music
      </Link>
      <Link to="/watch" className="block py-2 text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm" onClick={handleNavLinkClick}>
        Watch
      </Link>
      <Link to="/events" className="block py-2 text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm" onClick={handleNavLinkClick}>
        Events
      </Link>
      <Link to="/masterclasses" className="block py-2 text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm" onClick={handleNavLinkClick}>
        Masterclasses
      </Link>
      <Link to="/shop" className="block py-2 text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm" onClick={handleNavLinkClick}>
        Shop
      </Link>
    </>
  );

  return (
    <header className="bg-background text-foreground shadow-sm p-4 flex items-center justify-between border-b border-border sticky top-0 z-50">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-heading font-extrabold uppercase text-foreground">
          MONO<span className="text-primary">[KROMATIK]</span> NETWORK
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6">
        {navLinks}
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
        {isAuthenticated && (
          <>
            <Button asChild variant="ghost" size="icon" className="text-foreground hover:bg-secondary hover:text-primary">
              <Link to="/playlists">
                <ListMusic className="h-6 w-6" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="text-foreground hover:bg-secondary hover:text-primary">
              <Link to="/watchlist">
                <Heart className="h-6 w-6" />
              </Link>
            </Button>
          </>
        )}
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

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary hover:text-primary">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] bg-sidebar text-sidebar-foreground border-sidebar-border">
              <SheetHeader>
                <SheetTitle className="text-2xl font-heading font-extrabold uppercase text-sidebar-foreground">
                  MENU
                </SheetTitle>
                <SheetDescription className="text-muted-foreground font-sans">
                  Navigate the network.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-6">
                {navLinks}
                <Separator className="bg-sidebar-border my-2" />
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="block py-2 text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm" onClick={handleNavLinkClick}>
                      <User className="inline-block mr-2 h-5 w-5" /> Profile
                    </Link>
                    <Link to="/playlists" className="block py-2 text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm" onClick={handleNavLinkClick}>
                      <ListMusic className="inline-block mr-2 h-5 w-5" /> Playlists
                    </Link>
                    <Link to="/watchlist" className="block py-2 text-foreground hover:text-primary hover:underline transition-colors uppercase font-medium text-sm" onClick={handleNavLinkClick}>
                      <Heart className="inline-block mr-2 h-5 w-5" /> Watchlist
                    </Link>
                    <Button variant="outline" onClick={handleLoginLogout} className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase font-semibold text-sm px-4 py-2">
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={handleLoginLogout} className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase font-semibold text-sm px-4 py-2">
                    Login
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;