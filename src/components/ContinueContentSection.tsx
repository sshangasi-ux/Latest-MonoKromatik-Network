"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { fetchUserProgress } from "@/lib/supabase";
import ContentCard from "./ContentCard";
import ContentCardSkeleton from "./ContentCardSkeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress"; // Import Progress component

interface ContentItemWithProgress {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event";
  link: string;
  progress_data?: {
    time?: number;
    percentage?: number;
  };
}

const ContinueContentSection = () => {
  const { user, isAuthenticated } = useAuth();
  const [progressItems, setProgressItems] = useState<ContentItemWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProgress = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedProgress = await fetchUserProgress(user.id, 5); // Fetch up to 5 items
        
        const itemsWithLinks: ContentItemWithProgress[] = fetchedProgress
          .filter(p => p.content) // Ensure content data exists
          .map((p: any) => {
            let linkPrefix = '';
            switch (p.content.type) {
              case 'show': linkPrefix = '/shows'; break;
              case 'video': linkPrefix = '/watch'; break;
              case 'article': linkPrefix = '/news'; break;
              case 'event': linkPrefix = '/events'; break;
              default: linkPrefix = '';
            }
            return {
              ...p.content,
              link: `${linkPrefix}/${p.content.link_slug}`,
              progress_data: p.progress_data,
            };
          });
        setProgressItems(itemsWithLinks);
      } catch (err) {
        console.error("Failed to fetch user progress:", err);
        setError("Failed to load your progress. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getProgress();
  }, [isAuthenticated, user]);

  if (!isAuthenticated || (loading && progressItems.length === 0)) {
    return null; // Don't render if not authenticated or loading with no items
  }

  if (error) {
    return (
      <section className="py-12 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 uppercase">Continue Watching/Reading</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  if (progressItems.length === 0 && !loading) {
    return null; // Don't render if no progress items and not loading
  }

  return (
    <section className="py-12 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase">Continue Watching/Reading</h2>
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
              {progressItems.map((item) => (
                <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Link to={item.link} className="block h-full relative">
                    <ContentCard
                      type={item.type}
                      title={item.title}
                      description={item.description}
                      imageUrl={item.image_url}
                      category={item.category}
                      link={item.link}
                    />
                    {(item.progress_data?.percentage !== undefined || item.progress_data?.time !== undefined) && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <Progress
                          value={item.progress_data?.percentage !== undefined ? item.progress_data.percentage * 100 : 0}
                          className="h-2 bg-gray-700"
                          indicatorClassName="bg-red-600"
                        />
                        <p className="text-xs text-gray-300 mt-1">
                          {item.progress_data?.percentage !== undefined
                            ? `${Math.round(item.progress_data.percentage * 100)}% Read`
                            : "Started"}
                        </p>
                      </div>
                    )}
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-neutral-800 text-white hover:bg-neutral-700" />
            <CarouselNext className="right-4 bg-neutral-800 text-white hover:bg-neutral-700" />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default ContinueContentSection;