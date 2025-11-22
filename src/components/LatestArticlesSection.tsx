"use client";

import React from "react";
import ContentCard from "./ContentCard";
import { recentArticles } from "@/data/content"; // Import data
import { Button } from "@/components/ui/button"; // Import Button component
import { Link } from "react-router-dom"; // Import Link for navigation

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
        <div className="text-center mt-10">
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 rounded-lg uppercase font-bold transition-colors">
            <Link to="/articles">View All Articles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestArticlesSection;