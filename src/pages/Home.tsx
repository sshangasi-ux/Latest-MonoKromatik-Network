"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import LiveTicker from "@/components/LiveTicker";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <LiveTicker />
        <div className="text-center p-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Welcome to MonoKromatik Network
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your hub for creative solutions. More content sections coming soon!
          </p>
        </div>
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default Home;