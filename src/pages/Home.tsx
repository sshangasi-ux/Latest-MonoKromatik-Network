"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import LiveTicker from "@/components/LiveTicker";
import FeaturedShowsCarousel from "@/components/FeaturedShowsCarousel";
import VideoSpotlightCarousel from "@/components/VideoSpotlightCarousel";
import ArticleGrid from "@/components/ArticleGrid";
import UpcomingEventsCarousel from "@/components/UpcomingEventsCarousel";
import MembershipCTA from "@/components/MembershipCTA";
import TrendingArticlesSection from "@/components/TrendingArticlesSection";
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

// Define categories for the home page section
const homeCategories = [
  { name: "Music", description: "Vibrant rhythms", link: "/category/music" },
  { name: "Tech", description: "Innovations", link: "/category/tech" },
  { name: "Fashion", description: "Bold designs", link: "/category/fashion" },
  { name: "Sports", description: "Athletes & events", link: "/category/sports" },
  { name: "Culture", description: "Rich traditions", link: "/category/culture" },
  { name: "Nature", description: "Wildlife wonders", link: "/category/nature" },
];

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-grow">
        <LiveTicker />
        <HeroSection />

        {/* Categories Section on Home Page */}
        <section className="py-12 bg-black text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase">Explore Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {homeCategories.map((category) => (
                <Link
                  to={category.link}
                  key={category.name}
                  className="flex flex-col justify-center items-center p-4 bg-neutral-900 text-white border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:text-red-500 transition-colors duration-300 h-full"
                >
                  <h3 className="text-lg font-semibold text-center">{category.name}</h3>
                  <p className="text-sm text-gray-400 text-center mt-1">
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/categories" className="text-red-600 hover:text-red-500 underline font-medium">
                View All Categories
              </Link>
            </div>
          </div>
        </section>

        <TrendingArticlesSection />
        <FeaturedShowsCarousel />
        <VideoSpotlightCarousel />
        <ArticleGrid />
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
    </div>
  );
};

export default Home;