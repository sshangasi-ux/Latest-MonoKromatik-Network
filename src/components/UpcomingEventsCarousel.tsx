"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ContentCard from "./ContentCard";
import ContentCardSkeleton from "./ContentCardSkeleton";
import { fetchContent } from "@/lib/supabase"; // Import fetchContent
import { Button } from "@/components/ui/button"; // Import Button
import { Link } from "react-router-dom"; // Import Link
import { dummyEvents } from "@/data/dummyContent"; // Import dummy content

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: string;
}

const UpcomingEventsCarousel = () => {
  const [events, setEvents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);
        const { data } = await fetchContent('event', 6); // Destructure data, limit to 6
        setEvents(data as ContentItem[]);
      } catch (err) {
        console.error("Failed to fetch upcoming events:", err);
        setError("Failed to load upcoming events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  if (error) {
    return (
      <section className="py-12 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 uppercase">Upcoming Events</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  const contentToDisplay = events.length > 0 ? events : dummyEvents;

  return (
    <section className="py-12 bg-neutral-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase">Upcoming Events</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {contentToDisplay.map((event) => (
                  <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <ContentCard
                      type="event"
                      title={event.title}
                      description={event.description}
                      imageUrl={event.image_url}
                      category={event.category}
                      link={`/events/${event.link_slug}`}
                    />
                  </CarouselItem>
                ))
              }
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-neutral-800 text-white hover:bg-neutral-700" />
            <CarouselNext className="right-4 bg-neutral-800 text-white hover:bg-neutral-700" />
          </Carousel>
        )}
        <div className="text-center mt-10">
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 rounded-lg uppercase font-bold transition-colors">
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsCarousel;