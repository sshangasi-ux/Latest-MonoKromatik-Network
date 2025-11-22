"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import { recentArticles } from "../data/content"; // Import all recent articles

const Articles = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-white uppercase">All Articles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((article) => (
            <ContentCard
              key={article.id}
              type="article"
              title={article.title}
              description={article.description}
              imageUrl={article.image_url} // Use image_url
              category={article.category}
              link={`/news/${article.link_slug}`} // Construct link
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Articles;