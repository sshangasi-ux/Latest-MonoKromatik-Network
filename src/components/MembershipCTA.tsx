"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MembershipCTA = () => {
  return (
    <section className="bg-primary text-primary-foreground py-16 text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Unlock Exclusive African Content
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          Become a member today to get unlimited access to premium shows, ad-free viewing, and special events.
        </p>
        <Button asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-10 py-7 rounded-full uppercase font-bold transition-colors shadow-lg">
          <Link to="/membership">Join Now</Link>
        </Button>
      </div>
    </section>
  );
};

export default MembershipCTA;