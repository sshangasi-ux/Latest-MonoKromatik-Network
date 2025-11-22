"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProfileForm from "./ProfileForm"; // New import

const UserNav = () => {
  const { logout, user } = useAuth();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  // Use Supabase user data if available, otherwise fallback to placeholder
  const userName = user?.user_metadata?.full_name || user?.email || "Guest";
  const userEmail = user?.email || "N/A";
  const userAvatar = user?.user_metadata?.avatar_url || "https://github.com/shadcn.png"; // Placeholder or actual avatar URL from Supabase

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>{getInitials(userName)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userEmail}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setIsProfileDialogOpen(true)}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/my-feed">My Feed</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/saved-content">Saved Content</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">User Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/subscription">Subscription</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/offline-content">Offline Content</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="bg-neutral-900 text-white border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Edit Profile</DialogTitle>
        </DialogHeader>
        <ProfileForm onClose={() => setIsProfileDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default UserNav;