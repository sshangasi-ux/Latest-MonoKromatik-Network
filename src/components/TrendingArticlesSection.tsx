"use client";

import React, { useEffect, useState } from "react";
import ContentCard from "./ContentCard";
import ContentCardSkeleton from "./ContentCardSkeleton";
import { fetchContent } from "@/lib/supabase"; // Import fetchContent
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: string;
}

const TrendingArticlesSection = () => {
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getArticles = async () => {
      try {
        setLoading(true);
        const { data } = await fetchContent('article'); // Destructure data
        // For "trending", we'll just take the first 3 for now, similar to static data.
        setArticles((data as ContentItem[]).slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch trending articles:", err);
        setError("Failed to load trending articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, []);

  if (error) {
    return (
      <section className="py-12 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 uppercase">Trending Articles This Week</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase">Trending Articles This Week</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ContentCard
                key={article.id}
                type="article"
                title={article.title}
                description={article.description}
                imageUrl={article.image_url}
                category={article.category}
                link={`/news/${article.link_slug}`}
              />
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-8">No trending articles available.</div>
        )}
        <div className="text-center mt-10">
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 rounded-lg uppercase font-bold transition-colors">
            <Link to="/articles">View All Articles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrendingArticlesSection;