"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import LiveTicker from "@/components/LiveTicker";
import FeaturedShowsCarousel from "@/components/FeaturedShowsCarousel";
import VideoSpotlightCarousel from "@/components/VideoSpotlightCarousel";
import ArticleGrid from "@/components/ArticleGrid";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <LiveTicker />
        <div className="text-center p-8 bg-black text-white">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Welcome to MonoKromatik Network
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your hub for cutting-edge sports, culture, music, fashion, and lifestyle.
          </p>
        </div>
        <FeaturedShowsCarousel />
        <VideoSpotlightCarousel />
        <ArticleGrid />
        {/* More content sections like upcoming events, AI-driven picks, and membership CTA will go here */}
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default Home;