"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import {
  featuredShows,
  videoSpotlights,
  recentArticles,
  upcomingEvents,
} from "@/data/content";

const CategoryDetailPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [categoryContent, setCategoryContent] = useState<any[]>([]);

  useEffect(() => {
    const allContent = [
      ...featuredShows.map(item => ({ ...item, type: "show" })),
      ...videoSpotlights.map(item => ({ ...item, type: "video" })),
      ...recentArticles.map(item => ({ ...item, type: "article" })),
      ...upcomingEvents.map(item => ({ ...item, type: "event" })),
    ];

    if (categoryName) {
      const lowerCaseCategoryName = categoryName.toLowerCase();
      const filtered = allContent.filter(
        (item) => item.category.toLowerCase() === lowerCaseCategoryName
      );
      setCategoryContent(filtered);
    } else {
      setCategoryContent([]);
    }
  }, [categoryName]);

  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white uppercase">
          {categoryName ? formatCategoryName(categoryName) : "Category"} Content
        </h1>

        {categoryContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryContent.map((item) => (
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
          <p className="text-xl text-gray-600 dark:text-gray-300 text-center">
            No content found for this category.
          </p>
        )}
        <div className="mt-8 text-center">
          <Link to="/categories" className="text-blue-500 hover:text-blue-700 underline">
            Back to Categories
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryDetailPage;