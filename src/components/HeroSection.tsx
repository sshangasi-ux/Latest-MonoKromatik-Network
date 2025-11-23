"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative bg-background text-foreground py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Placeholder for a dynamic background image or video */}
        <img
          src="https://via.placeholder.com/1920x1080/000000/FFFFFF?text=African+Culture+Hero"
          alt="Hero Background"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 gradient-hero"></div> {/* Custom hero gradient */}
      </div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold leading-tight mb-6 drop-shadow-lg text-foreground uppercase tracking-tight">
          Experience the Pulse of African Content
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto font-sans">
          Dive into a rich tapestry of shows, news, music, and events from across the continent.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-lg uppercase font-semibold transition-all shadow-lg hover:scale-[1.02] hover:shadow-primary/20">
            <Link to="/shows">Explore Shows</Link>
          </Button>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6 rounded-lg uppercase font-semibold transition-all shadow-lg hover:scale-[1.02] hover:shadow-primary/20">
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;