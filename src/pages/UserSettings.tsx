"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription, // Added DialogDescription import
} from "@/components/ui/dialog";
import ProfileForm from "@/components/ProfileForm";
import UpdateEmailForm from "@/components/UpdateEmailForm";
import UpdatePasswordForm from "@/components/UpdatePasswordForm";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserSettings = () => {
  const { user } = useAuth();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.email || "Guest";
  const userEmail = user?.email || "N/A";
  const userAvatar = user?.user_metadata?.avatar_url || "https://github.com/shadcn.png";

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-white uppercase">User Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="bg-neutral-900 text-white border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-red-600 text-white text-xl">{getInitials(userName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{userName}</p>
                  <p className="text-sm text-gray-400">{userEmail}</p>
                </div>
              </div>
              <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-900 text-white border-neutral-800">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white">Edit Profile</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Update your public profile information.
                    </DialogDescription>
                  </DialogHeader>
                  <ProfileForm onClose={() => setIsProfileDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Update Email Card */}
          <Card className="bg-neutral-900 text-white border-neutral-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Update Email</CardTitle>
              <CardDescription className="text-gray-400">
                Change the email address associated with your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                    Change Email
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-900 text-white border-neutral-800">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white">Update Email</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Enter your new email address. A verification email will be sent.
                    </DialogDescription>
                  </DialogHeader>
                  <UpdateEmailForm onClose={() => setIsEmailDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Update Password Card */}
          <Card className="bg-neutral-900 text-white border-neutral-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Update Password</CardTitle>
              <CardDescription className="text-gray-400">
                Change your account password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-900 text-white border-neutral-800">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white">Update Password</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Enter a new strong password for your account.
                    </DialogDescription>
                  </DialogHeader>
                  <UpdatePasswordForm onClose={() => setIsPasswordDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserSettings;