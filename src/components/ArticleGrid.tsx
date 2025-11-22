"use client";

import React from "react";
import ContentCard from "./ContentCard";

const recentArticles = [
  {
    id: "1",
    title: "The Rise of Afrobeats: A Global Phenomenon",
    description: "How African music is dominating charts and influencing cultures worldwide.",
    imageUrl: "https://via.placeholder.com/400x250/3A3A3A/FFFFFF?text=Afrobeats+Article",
    category: "Music",
    link: "/news/afrobeats-rise",
  },
  {
    id: "2",
    title: "Sustainable Fashion: Africa's Green Revolution",
    description: "African designers are leading the charge in eco-friendly fashion.",
    imageUrl: "https://via.placeholder.com/400x250/C1272D/FFFFFF?text=Sustainable+Fashion",
    category: "Fashion",
    link: "/news/sustainable-fashion",
  },
  {
    id: "3",
    title: "Startup Boom: Innovation Hubs Across the Continent",
    description: "A deep dive into the thriving startup ecosystems in major African cities.",
    imageUrl: "https://via.placeholder.com/400x250/1F1F1F/FFFFFF?text=Startup+Boom",
    category: "Tech",
    link: "/news/startup-boom",
  },
  {
    id: "4",
    title: "African Football: Beyond the Pitch",
    description: "Exploring the cultural and economic impact of football in Africa.",
    imageUrl: "https://via.placeholder.com/400x250/000000/FFFFFF?text=Football+Culture",
    category: "Sports",
    link: "/news/african-football",
  },
  {
    id: "5",
    title: "The Art of Storytelling: African Literature Today",
    description: "Contemporary authors redefining narratives and captivating global audiences.",
    imageUrl: "https://via.placeholder.com/400x250/C1272D/FFFFFF?text=African+Literature",
    category: "Culture",
    link: "/news/african-literature",
  },
  {
    id: "6",
    title: "Travel Africa: Hidden Gems and Must-Visit Destinations",
    description: "Uncover the continent's most breathtaking landscapes and cultural experiences.",
    imageUrl: "https://via.placeholder.com/400x250/3A3A3A/FFFFFF?text=Travel+Africa",
    category: "Lifestyle",
    link: "/news/travel-africa",
  },
];

const ArticleGrid = () => {
  return (
    <section className="py-12 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase">Recent Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((article) => (
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

export default ArticleGrid;