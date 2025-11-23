"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-background to-secondary text-foreground py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Placeholder for a dynamic background image or video */}
        <img
          src="https://via.placeholder.com/1920x1080/000000/FFFFFF?text=African+Culture+Hero"
          alt="Hero Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg text-foreground">
          Experience the Pulse of African Content
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
          Dive into a rich tapestry of shows, news, music, and events from across the continent.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-lg uppercase font-bold transition-colors shadow-lg">
            <Link to="/shows">Explore Shows</Link>
          </Button>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6 rounded-lg uppercase font-bold transition-colors shadow-lg">
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;