"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Crown, Lock } from "lucide-react"; // Import icons
import { Button } from "@/components/ui/button";

const MembershipPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8 flex flex-col items-center justify-center text-center">
        <Crown className="h-24 w-24 text-primary mb-6" />
        <h1 className="text-5xl font-heading font-extrabold mb-4 uppercase tracking-tight">
          Exclusive Membership Coming Soon!
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl font-sans leading-relaxed">
          Unlock premium content, ad-free viewing, special events, and more with a MonoKromatik Network membership. We're crafting an unparalleled experience just for you.
        </p>
        <div className="flex items-center text-muted-foreground text-lg mb-10 font-sans">
          <Lock className="h-6 w-6 mr-2" />
          <span>Premium Access</span>
        </div>
        <p className="text-muted-foreground text-sm mb-8 max-w-xl font-sans">
          Implementing a full membership system typically involves subscription management (e.g., Stripe, PayPal), user roles, and content access control. We can integrate these features in a phased approach when you're ready.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
          <Link to="/">Back to Home</Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
};

export default MembershipPage;