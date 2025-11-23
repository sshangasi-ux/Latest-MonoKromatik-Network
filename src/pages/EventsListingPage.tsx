"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import PaginationControls from "@/components/PaginationControls";
import { fetchContent } from "@/lib/supabase";
import { dummyEvents } from "@/data/dummyContent";

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

const EventsListingPage = () => {
  const [events, setEvents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const { data, count } = await fetchContent('event', ITEMS_PER_PAGE, offset);

        if (data) {
          const mappedEvents: ContentItem[] = data.map(item => ({
            ...item,
            link: `/events/${item.link_slug}`,
          }));
          setEvents(mappedEvents);
          setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
        } else {
          const startIndex = offset;
          const endIndex = offset + ITEMS_PER_PAGE;
          const paginatedDummy = dummyEvents.slice(startIndex, endIndex).map(item => ({
            ...item,
            link: `/events/${item.link_slug}`,
          }));
          setEvents(paginatedDummy);
          setTotalPages(Math.ceil(dummyEvents.length / ITEMS_PER_PAGE));
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events. Please try again later.");
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const startIndex = offset;
        const endIndex = offset + ITEMS_PER_PAGE;
        const paginatedDummy = dummyEvents.slice(startIndex, endIndex).map(item => ({
          ...item,
          link: `/events/${item.link_slug}`,
        }));
        setEvents(paginatedDummy);
        setTotalPages(Math.ceil(dummyEvents.length / ITEMS_PER_PAGE));
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">All Events</h1>

        {error && (
          <div className="text-center text-destructive text-xl font-sans mb-8">{error}</div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center text-muted-foreground text-xl font-sans">
            No events available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <ContentCard
                key={event.id}
                type="event"
                title={event.title}
                description={event.description}
                imageUrl={event.image_url}
                category={event.category}
                link={event.link}
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

export default EventsListingPage;