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
      <section className="py-12 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 uppercase">Video Spotlight</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  const contentToDisplay = videos.length > 0 ? videos : dummyVideos;

  return (
    <section className="py-12 bg-neutral-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase">Video Spotlight</h2>
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
                    />
                  </CarouselItem>
                ))
              }
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-neutral-800 text-white hover:bg-neutral-700" />
            <CarouselNext className="right-4 bg-neutral-800 text-white hover:bg-neutral-700" />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default VideoSpotlightCarousel;