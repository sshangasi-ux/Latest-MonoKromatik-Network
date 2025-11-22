"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { fetchHeroContent } from "@/lib/supabase"; // Import fetchHeroContent
import ContentCardSkeleton from "./ContentCardSkeleton"; // Reusing skeleton for loading state

interface HeroContent {
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
}

const HeroSection = () => {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getHeroContent = async () => {
      try {
        setLoading(true);
        const data = await fetchHeroContent();
        setHeroContent(data as HeroContent);
      } catch (err) {
        console.error("Failed to fetch hero content:", err);
        setError("Failed to load hero content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getHeroContent();
  }, []);

  if (loading) {
    return (
      <section className="relative h-[60vh] md:h-[80vh] bg-black flex items-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-neutral-800 animate-pulse opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 p-4 max-w-4xl mx-auto md:ml-16 md:mr-auto text-center md:text-left">
          <div className="h-12 md:h-16 w-3/4 bg-neutral-700 rounded mb-4 animate-pulse"></div>
          <div className="h-6 w-full bg-neutral-800 rounded mb-8 animate-pulse"></div>
          <div className="h-12 w-48 bg-neutral-700 rounded animate-pulse"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative h-[60vh] md:h-[80vh] bg-black flex items-center text-white overflow-hidden text-center">
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Error Loading Content</h1>
          <p className="text-xl text-gray-300">{error}</p>
        </div>
      </section>
    );
  }

  if (!heroContent) {
    return (
      <section className="relative h-[60vh] md:h-[80vh] bg-black flex items-center text-white overflow-hidden text-center">
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to MonoKromatik Network</h1>
          <p className="text-xl text-gray-300">No hero content configured yet. Please add an entry in Supabase.</p>
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 rounded-lg uppercase font-bold transition-colors mt-8">
            <Link to="/shows">Explore Now</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[60vh] md:h-[80vh] bg-black flex items-center text-white overflow-hidden">
      {/* Background Image/Video */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroContent.image_url}
          alt={heroContent.title}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 p-4 max-w-4xl mx-auto md:ml-16 md:mr-auto text-center md:text-left">
        <h1 className="text-5xl md:text-7xl font-extrabold uppercase mb-4 leading-tight">
          {heroContent.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          {heroContent.description}
        </p>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 rounded-lg uppercase font-bold transition-colors">
          <Link to={heroContent.cta_link}>{heroContent.cta_text}</Link>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;