"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LiveTicker from "@/components/LiveTicker";
import FeaturedShowsCarousel from "@/components/FeaturedShowsCarousel";
import VideoSpotlightCarousel from "@/components/VideoSpotlightCarousel";
import TrendingArticlesSection from "@/components/TrendingArticlesSection";
import UpcomingEventsCarousel from "@/components/UpcomingEventsCarousel";
import MembershipCTA from "@/components/MembershipCTA";
import Footer from "@/components/Footer";
import ContinueContentSection from "@/components/ContinueContentSection"; // New import

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <Header />
      <LiveTicker />
      <main className="flex-grow">
        <HeroSection />
        <ContinueContentSection /> {/* Added Continue Watching/Reading section */}
        <FeaturedShowsCarousel />
        <VideoSpotlightCarousel />
        <TrendingArticlesSection />
        <UpcomingEventsCarousel />
        <MembershipCTA />
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default Index;