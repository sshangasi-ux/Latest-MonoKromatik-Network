"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import PaginationControls from "@/components/PaginationControls";
import { fetchContent } from "@/lib/supabase";
import { dummyArticles } from "@/data/dummyContent";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event";
  link: string;
}

const ITEMS_PER_PAGE = 9;

const NewsListingPage = () => {
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const { data, count } = await fetchContent('article', ITEMS_PER_PAGE, offset);

        if (data) {
          const mappedArticles: ContentItem[] = data.map(item => ({
            ...item,
            link: `/news/${item.link_slug}`,
          }));
          setArticles(mappedArticles);
          setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
        } else {
          const startIndex = offset;
          const endIndex = offset + ITEMS_PER_PAGE;
          const paginatedDummy = dummyArticles.slice(startIndex, endIndex).map(item => ({
            ...item,
            link: `/news/${item.link_slug}`,
          }));
          setArticles(paginatedDummy);
          setTotalPages(Math.ceil(dummyArticles.length / ITEMS_PER_PAGE));
        }
      } catch (err) {
        console.error("Failed to fetch articles:", err);
        setError("Failed to load articles. Please try again later.");
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const startIndex = offset;
        const endIndex = offset + ITEMS_PER_PAGE;
        const paginatedDummy = dummyArticles.slice(startIndex, endIndex).map(item => ({
          ...item,
          link: `/news/${item.link_slug}`,
        }));
        setArticles(paginatedDummy);
        setTotalPages(Math.ceil(dummyArticles.length / ITEMS_PER_PAGE));
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">All News & Articles</h1>

        {error && (
          <div className="text-center text-destructive text-xl font-sans mb-8">{error}</div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center text-muted-foreground text-xl font-sans">
            No articles available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ContentCard
                key={article.id}
                type="article"
                title={article.title}
                description={article.description}
                imageUrl={article.image_url}
                category={article.category}
                link={article.link}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NewsListingPage;