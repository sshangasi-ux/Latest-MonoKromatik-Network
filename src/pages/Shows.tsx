"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import { fetchContent } from "@/lib/supabase"; // Import fetchContent

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: string;
}

const Shows = () => {
  const [shows, setShows] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getShows = async () => {
      try {
        setLoading(true);
        const data = await fetchContent('show');
        setShows(data as ContentItem[]);
      } catch (err) {
        console.error("Failed to fetch shows:", err);
        setError("Failed to load shows. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getShows();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Header />
        <main className="flex-grow container mx-auto p-8 text-center">
          <h1 className="text-4xl font-bold mb-8 text-white uppercase">All Shows</h1>
          <p className="text-red-500">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-white uppercase">All Shows</h1>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        ) : shows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shows.map((show) => (
              <ContentCard
                key={show.id}
                type="show"
                title={show.title}
                description={show.description}
                imageUrl={show.image_url}
                category={show.category}
                link={`/shows/${show.link_slug}`}
              />
            ))}
          </div>
        ) : (
          <p className="text-xl text-gray-300 text-center">No shows available.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Shows;