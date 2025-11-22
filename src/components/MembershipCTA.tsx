"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MembershipCTA = () => {
  return (
    <section className="bg-red-600 text-white py-16 px-4 text-center">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 uppercase leading-tight">
          Unlock Exclusive Access
        </h2>
        <p className="text-lg md:text-xl mb-8">
          Become a MonoKromatik Network member for premium content, ad-free viewing, and community perks.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-lg uppercase font-bold transition-colors">
            <Link to="/signup">Join Now</Link>
          </Button>
          <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 text-lg px-8 py-6 rounded-lg uppercase font-bold transition-colors">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MembershipCTA;