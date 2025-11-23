"use client";

import React, { useEffect, useState } from "react";
import ContentCard from "./ContentCard";
import ContentCardSkeleton from "./ContentCardSkeleton";
import { fetchContent } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { dummyArticles } from "@/data/dummyContent";

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
  const [loading, setLoading] = useState(true); // Fixed: Correctly initialized useState hook
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getArticles = async () => {
      try {
        setLoading(true);
        const { data } = await fetchContent('article', 3);
        setArticles(data as ContentItem[]);
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
      <section className="py-12 bg-background text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 uppercase tracking-tight">Trending Articles This Week</h2>
          <p className="text-destructive font-sans">{error}</p>
        </div>
      </section>
    );
  }

  const contentToDisplay = articles.length > 0 ? articles : dummyArticles.slice(0, 3);

  return (
    <section className="py-12 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">Trending Articles This Week</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentToDisplay.map((article) => (
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
        )}
        <div className="text-center mt-10">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
            <Link to="/articles">View All Articles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrendingArticlesSection;