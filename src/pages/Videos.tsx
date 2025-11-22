"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import { videoSpotlights } from "../data/content"; // Import all video spotlights

const Videos = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-white uppercase">All Videos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoSpotlights.map((video) => (
            <ContentCard
              key={video.id}
              type="video"
              title={video.title}
              description={video.description}
              imageUrl={video.image_url} // Use image_url
              category={video.category}
              link={`/watch/${video.link_slug}`} // Construct link
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Videos;