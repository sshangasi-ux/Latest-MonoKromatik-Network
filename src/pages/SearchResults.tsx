"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import { fetchContent } from "@/lib/supabase";
import {
  videoSpotlights,
  recentArticles,
  upcomingEvents,
} from "@/data/content";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event";
  full_content?: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const showsData = await fetchContent('show');
        const allContent: ContentItem[] = [
          ...(showsData as ContentItem[]).map(item => ({ ...item, link: `/shows/${item.link_slug}` })),
          ...videoSpotlights.map(item => ({ ...item, link: `/watch/${item.link_slug}` })),
          ...recentArticles.map(item => ({ ...item, link: `/news/${item.link_slug}` })),
          ...upcomingEvents.map(item => ({ ...item, link: `/events/${item.link_slug}` })),
        ];

        if (query) {
          const lowerCaseQuery = query.toLowerCase();
          const results = allContent.filter(
            (item) =>
              item.title.toLowerCase().includes(lowerCaseQuery) ||
              item.description.toLowerCase().includes(lowerCaseQuery) ||
              item.category.toLowerCase().includes(lowerCaseQuery)
          );
          setFilteredContent(results);
        } else {
          setFilteredContent([]);
        }
      } catch (err) {
        console.error("Failed to fetch content for search:", err);
        setError("Failed to load search results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllContent();
  }, [query]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Header />
        <main className="flex-grow container mx-auto p-8 text-center">
          <h1 className="text-4xl font-bold mb-8 text-white uppercase">Search Results</h1>
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
        <h1 className="text-4xl font-bold mb-8 text-center text-white uppercase">
          Search Results
        </h1>
        {query ? (
          <p className="text-xl text-gray-300 mb-6 text-center">
            Showing results for: "<span className="font-semibold">{query}</span>"
          </p>
        ) : (
          <p className="text-xl text-gray-300 mb-6 text-center">
            Please enter a search query.
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <ContentCard
                key={`${item.type}-${item.id}`}
                type={item.type}
                title={item.title}
                description={item.description}
                imageUrl={item.image_url} // Use image_url
                category={item.category}
                link={item.link} // Use the constructed link
              />
            ))}
          </div>
        ) : (
          query && (
            <p className="text-xl text-gray-300 text-center">
              No results found for "{query}".
            </p>
          )
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;