"use client";

import React from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MadeWithDyad } from "@/components/made-with-dyad";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <Header />
      <main className="flex-grow container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Search Results</h1>
        {query ? (
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Showing results for: "<span className="font-semibold">{query}</span>" (Content Coming Soon!)
          </p>
        ) : (
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Please enter a search query.
          </p>
        )}
        {/* In a real application, you would fetch and display search results here */}
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default SearchResults;