"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-white uppercase">About Us</h1>
        <div className="bg-neutral-900 p-6 rounded-lg shadow-md text-white">
          <p className="text-lg mb-4">
            Welcome to MonoKromatik Network, your premier destination for the vibrant pulse of Africa. We are dedicated to bringing you the most compelling stories, cutting-edge trends, and rich cultural experiences from across the continent.
          </p>
          <p className="text-lg mb-4">
            Our mission is to showcase the dynamic spirit of Africa through diverse content spanning sports, culture, music, fashion, and lifestyle. We believe in celebrating the innovation, creativity, and resilience that define the African narrative.
          </p>
          <p className="text-lg">
            Join us on a journey to explore the untold stories, discover emerging talents, and connect with the heart of Africa. MonoKromatik Network is more than just a platform; it's a community dedicated to fostering understanding and appreciation for the continent's profound impact on the global stage.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;