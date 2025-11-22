"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

const CategoryDetailPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [categoryContent, setCategoryContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const showsData = await fetchContent('show');
        const showsMapped = (showsData as ContentItem[]).map(item => ({ ...item, link: `/shows/${item.link_slug}` }));

        const allContent: ContentItem[] = [
          ...showsMapped,
          ...videoSpotlights.map(item => ({ ...item, link: `/watch/${item.link_slug}` })),
          ...recentArticles.map(item => ({ ...item, link: `/news/${item.link_slug}` })),
          ...upcomingEvents.map(item => ({ ...item, link: `/events/${item.link_slug}` })),
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
      } catch (err) {
        console.error("Failed to fetch category content:", err);
        setError("Failed to load category content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryContent();
  }, [categoryName]);

  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Header />
        <main className="flex-grow container mx-auto p-8 text-center">
          <h1 className="text-4xl font-bold mb-8 text-white uppercase">Category Content</h1>
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
          {categoryName ? formatCategoryName(categoryName) : "Category"} Content
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        ) : categoryContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryContent.map((item) => (
              <ContentCard
                key={`${item.type}-${item.id}`}
                type={item.type}
                title={item.title}
                description={item.description}
                imageUrl={item.image_url} // Use image_url
                category={item.category}
                link={`/${item.type === 'show' ? 'shows' : item.type === 'video' ? 'watch' : item.type === 'article' ? 'news' : 'events'}/${item.link_slug}`} // Construct link
              />
            ))}
          </div>
        ) : (
          <p className="text-xl text-gray-300 text-center">
            No content found for this category.
          </p>
        )}
        <div className="mt-8 text-center">
          <Link to="/categories" className="text-red-500 hover:text-red-400 underline">
            Back to Categories
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryDetailPage;