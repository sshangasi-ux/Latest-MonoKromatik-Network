"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Import Link for navigation

const HeroSection = () => {
  return (
    <section className="relative h-[60vh] md:h-[80vh] bg-black flex items-center text-white overflow-hidden">
      {/* Background Image/Video Placeholder */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://via.placeholder.com/1920x1080/000000/FFFFFF?text=Immersive+Hero+Background"
          alt="Hero Background"
          className="w-full h-full object-cover opacity-50"
        />
        {/* Dynamic overlays/micro-animations would go here */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 p-4 max-w-4xl mx-auto md:ml-16 md:mr-auto text-center md:text-left">
        <h1 className="text-5xl md:text-7xl font-extrabold uppercase mb-4 leading-tight">
          Experience the Pulse of Africa
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Your hub for cutting-edge sports, culture, music, fashion, and lifestyle.
        </p>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 rounded-lg uppercase font-bold transition-colors">
          <Link to="/shows">Explore Now</Link>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;