"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import { fetchContent } from "@/lib/supabase";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event";
  full_content?: string;
  link: string;
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
        const { data: allSupabaseContentData } = await fetchContent(); // Destructure data
        const mappedContent: ContentItem[] = (allSupabaseContentData as ContentItem[]).map(item => {
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

        if (categoryName) {
          const lowerCaseCategoryName = categoryName.toLowerCase();
          const filtered = mappedContent.filter(
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
                imageUrl={item.image_url}
                category={item.category}
                link={item.link}
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