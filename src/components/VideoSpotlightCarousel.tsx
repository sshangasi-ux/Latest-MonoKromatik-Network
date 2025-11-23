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
import { fetchContent } from "@/lib/supabase";
import { dummyVideos } from "@/data/dummyContent";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: string;
}

const VideoSpotlightCarousel = () => {
  const [videos, setVideos] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getVideos = async () => {
      try {
        setLoading(true);
        const { data } = await fetchContent('video', 6);
        setVideos(data as ContentItem[]);
      } catch (err) {
        console.error("Failed to fetch video spotlights:", err);
        setError("Failed to load video spotlights. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getVideos();
  }, []);

  if (error) {
    return (
      <section className="py-12 bg-secondary text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 uppercase tracking-tight">Video Spotlight</h2>
          <p className="text-destructive font-sans">{error}</p>
        </div>
      </section>
    );
  }

  const contentToDisplay = videos.length > 0 ? videos : dummyVideos;

  return (
    <section className="py-12 bg-secondary text-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">Video Spotlight</h2>
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
              {contentToDisplay.map((video) => (
                  <CarouselItem key={video.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <ContentCard
                      type="video"
                      title={video.title}
                      description={video.description}
                      imageUrl={video.image_url}
                      category={video.category}
                      link={`/watch/${video.link_slug}`}
                      contentId={video.id} // Added contentId prop
                    />
                  </CarouselItem>
                ))
              }
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary" />
            <CarouselNext className="right-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary" />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default VideoSpotlightCarousel;