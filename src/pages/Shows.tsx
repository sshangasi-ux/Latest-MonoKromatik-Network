"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MadeWithDyad } from "@/components/made-with-dyad";
import ContentCard from "@/components/ContentCard";
import { featuredShows } from "../data/content"; // Updated import path

const Shows = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white uppercase">All Shows</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredShows.map((show) => (
            <ContentCard
              key={show.id}
              type="show"
              title={show.title}
              description={show.description}
              imageUrl={show.imageUrl}
              category={show.category}
              link={show.link}
            />
          ))}
        </div>
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default Shows;