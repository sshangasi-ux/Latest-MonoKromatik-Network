"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import { searchContent } from "@/lib/supabase";
import { allDummyContent } from "@/data/dummyContent"; // Fallback for dummy content

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event";
  link: string;
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const { data, error } = await searchContent(query, 20); // Fetch up to 20 results
        if (error) {
          throw error;
        }
        const mappedResults: ContentItem[] = (data as ContentItem[]).map(item => {
          let linkPrefix = '';
          switch (item.type) {
            case 'show': linkPrefix = '/shows'; break;
            case 'video': linkPrefix = '/watch'; break;
            case 'article': linkPrefix = '/news'; break;
            case 'event': linkPrefix = '/events'; break;
            default: linkPrefix = '';
          }
          return { ...item, link: `${linkPrefix}/${item.link_slug}` };
        });
        setResults(mappedResults);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
        setError("Failed to load search results. Please try again later.");
        // Fallback to dummy content for search if API fails
        const dummyFiltered = allDummyContent.filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 20);
        setResults(dummyFiltered);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center uppercase">
          Search Results for "{query}"
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 text-xl">{error}</div>
        ) : results.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">
            No results found for "{query}". Try a different search term.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => (
              <ContentCard
                key={item.id}
                type={item.type}
                title={item.title}
                description={item.description}
                imageUrl={item.image_url}
                category={item.category}
                link={item.link}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/" className="text-red-500 hover:text-red-400 underline">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;