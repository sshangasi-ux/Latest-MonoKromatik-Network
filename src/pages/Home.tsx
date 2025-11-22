"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import LiveTicker from "@/components/LiveTicker";
import FeaturedShowsCarousel from "@/components/FeaturedShowsCarousel";
import VideoSpotlightCarousel from "@/components/VideoSpotlightCarousel";
import ArticleGrid from "@/components/ArticleGrid";
import UpcomingEventsCarousel from "@/components/UpcomingEventsCarousel";
import MembershipCTA from "@/components/MembershipCTA";
import LatestArticlesSection from "@/components/LatestArticlesSection"; // New import

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
        <LatestArticlesSection /> {/* Add the new section here */}
        <UpcomingEventsCarousel />
        <MembershipCTA />
        {/* Placeholder for AI-driven "Smart Picks for You" - will require backend integration */}
        <section className="py-12 bg-black text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase">Smart Picks for You (Coming Soon!)</h2>
          <p className="text-lg text-gray-400">
            Our AI will soon learn your preferences to deliver personalized content.
          </p>
        </section>
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default Home;