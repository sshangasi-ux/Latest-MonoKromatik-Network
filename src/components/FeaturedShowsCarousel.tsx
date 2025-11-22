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
import ContentCardSkeleton from "./ContentCardSkeleton"; // Import skeleton
import { fetchContent } from "@/lib/supabase"; // New import for Supabase fetching

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string; // Changed from imageUrl to image_url to match Supabase schema
  category: string;
  link_slug: string; // Changed from link to link_slug to match Supabase schema
  type: string;
}

const FeaturedShowsCarousel = () => {
  const [shows, setShows] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFeaturedShows = async () => {
      try {
        setLoading(true);
        // Fetch content of type 'show' from Supabase
        const data = await fetchContent('show');
        setShows(data as ContentItem[]);
      } catch (err) {
        console.error("Failed to fetch featured shows:", err);
        setError("Failed to load featured shows. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getFeaturedShows();
  }, []);

  if (error) {
    return (
      <section className="py-12 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 uppercase">Featured Shows</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase">Featured Shows</h2>
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
              {shows.length > 0 ? (
                shows.map((show) => (
                  <CarouselItem key={show.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <ContentCard
                      type="show"
                      title={show.title}
                      description={show.description}
                      imageUrl={show.image_url} // Use image_url
                      category={show.category}
                      link={`/shows/${show.link_slug}`} // Construct link from link_slug
                    />
                  </CarouselItem>
                ))
              ) : (
                <div className="w-full text-center py-8">No featured shows available.</div>
              )}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-neutral-800 text-white hover:bg-neutral-700" />
            <CarouselNext className="right-4 bg-neutral-800 text-white hover:bg-neutral-700" />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default FeaturedShowsCarousel;