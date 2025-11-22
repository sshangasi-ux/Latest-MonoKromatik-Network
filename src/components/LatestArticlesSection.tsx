"use client";

import React from "react";
import ContentCard from "./ContentCard";
import { recentArticles } from "@/data/content"; // Import data

const LatestArticlesSection = () => {
  // Display the first 3 recent articles for this section
  const articlesToShow = recentArticles.slice(0, 3);

  return (
    <section className="py-12 bg-neutral-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase">Latest from the Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articlesToShow.map((article) => (
            <ContentCard
              key={article.id}
              type="article"
              title={article.title}
              description={article.description}
              imageUrl={article.imageUrl}
              category={article.category}
              link={article.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestArticlesSection;