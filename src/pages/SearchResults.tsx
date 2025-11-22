"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import {
  featuredShows,
  videoSpotlights,
  recentArticles,
  upcomingEvents,
} from "@/data/content";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [filteredContent, setFilteredContent] = useState<any[]>([]);

  useEffect(() => {
    const allContent = [
      ...featuredShows.map(item => ({ ...item, type: "show" })),
      ...videoSpotlights.map(item => ({ ...item, type: "video" })),
      ...recentArticles.map(item => ({ ...item, type: "article" })),
      ...upcomingEvents.map(item => ({ ...item, type: "event" })),
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
  }, [query]);

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

        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <ContentCard
                key={`${item.type}-${item.id}`}
                type={item.type}
                title={item.title}
                description={item.description}
                imageUrl={item.imageUrl}
                category={item.category}
                link={item.link}
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