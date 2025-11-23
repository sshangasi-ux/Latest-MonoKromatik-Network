"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import PaginationControls from "@/components/PaginationControls"; // Import PaginationControls
import { fetchContent } from "@/lib/supabase";
import { dummyShows } from "@/data/dummyContent"; // Fallback dummy data

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

const ITEMS_PER_PAGE = 9; // Define how many items per page

const ShowsListingPage = () => {
  const [shows, setShows] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getShows = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const { data, count } = await fetchContent('show', ITEMS_PER_PAGE, offset);

        if (data) {
          const mappedShows: ContentItem[] = data.map(item => ({
            ...item,
            link: `/shows/${item.link_slug}`,
          }));
          setShows(mappedShows);
          setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
        } else {
          // Fallback to dummy data if no data from Supabase
          const startIndex = offset;
          const endIndex = offset + ITEMS_PER_PAGE;
          const paginatedDummy = dummyShows.slice(startIndex, endIndex).map(item => ({
            ...item,
            link: `/shows/${item.link_slug}`,
          }));
          setShows(paginatedDummy);
          setTotalPages(Math.ceil(dummyShows.length / ITEMS_PER_PAGE));
        }
      } catch (err) {
        console.error("Failed to fetch shows:", err);
        setError("Failed to load shows. Please try again later.");
        // Fallback to dummy data on error
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const startIndex = offset;
        const endIndex = offset + ITEMS_PER_PAGE;
        const paginatedDummy = dummyShows.slice(startIndex, endIndex).map(item => ({
          ...item,
          link: `/shows/${item.link_slug}`,
        }));
        setShows(paginatedDummy);
        setTotalPages(Math.ceil(dummyShows.length / ITEMS_PER_PAGE));
      } finally {
        setLoading(false);
      }
    };

    getShows();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">All Shows</h1>

        {error && (
          <div className="text-center text-destructive text-xl font-sans mb-8">{error}</div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        ) : shows.length === 0 ? (
          <div className="text-center text-muted-foreground text-xl font-sans">
            No shows available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shows.map((show) => (
              <ContentCard
                key={show.id}
                type="show"
                title={show.title}
                description={show.description}
                imageUrl={show.image_url}
                category={show.category}
                link={show.link}
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

export default ShowsListingPage;