"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LiveTicker from "@/components/LiveTicker";
import FeaturedShowsCarousel from "@/components/FeaturedShowsCarousel";
import VideoSpotlightCarousel from "@/components/VideoSpotlightCarousel";
import TrendingArticlesSection from "@/components/TrendingArticlesSection";
import UpcomingEventsCarousel from "@/components/UpcomingEventsCarousel";
import MembershipCTA from "@/components/MembershipCTA";
import Footer from "@/components/Footer";
import ContinueContentSection from "@/components/ContinueContentSection";
import SmartPicksSection from "@/components/SmartPicksSection";
import SponsoredContentSection from "@/components/SponsoredContentSection";
import LatestContentCarousel from "@/components/LatestContentCarousel";
import InnovatorsSpotlightSection from "@/components/InnovatorsSpotlightSection";
import MasterclassesSection from "@/components/MasterclassesSection"; // Import new component

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <LiveTicker />
      <main className="flex-grow">
        <HeroSection />
        <ContinueContentSection />
        <SmartPicksSection />
        <InnovatorsSpotlightSection />
        <MasterclassesSection /> {/* Add the new section here */}
        <LatestContentCarousel />
        <SponsoredContentSection />
        <FeaturedShowsCarousel />
        <VideoSpotlightCarousel />
        <TrendingArticlesSection />
        <UpcomingEventsCarousel />
        <MembershipCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;