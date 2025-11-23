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
import { allDummyContent } from "@/data/dummyContent"; // Using allDummyContent for fallback

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event" | "sponsored" | "music_show";
  link: string;
}

const LatestContentCarousel = () => {
  const [latestItems, setLatestItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLatestContent = async () => {
      try {
        setLoading(true);
        // Fetch the 6 most recent content items of any type
        const { data } = await fetchContent(undefined, 6); 
        
        if (data) {
          const mappedContent: ContentItem[] = (data as ContentItem[]).map(item => {
            let linkPrefix = '';
            switch (item.type) {
              case 'show': linkPrefix = '/shows'; break;
              case 'video': linkPrefix = '/watch'; break;
              case 'article': linkPrefix = '/news'; break;
              case 'event': linkPrefix = '/events'; break;
              case 'sponsored': linkPrefix = '/sponsored'; break;
              case 'music_show': linkPrefix = '/music/shows'; break;
              default: linkPrefix = '';
            }
            return { ...item, link: `${linkPrefix}/${item.link_slug}` };
          });
          setLatestItems(mappedContent);
        } else {
          // Fallback to dummy content if no data from Supabase
          setLatestItems(allDummyContent.slice(0, 6).map(item => {
            let linkPrefix = '';
            switch (item.type) {
              case 'show': linkPrefix = '/shows'; break;
              case 'video': linkPrefix = '/watch'; break;
              case 'article': linkPrefix = '/news'; break;
              case 'event': linkPrefix = '/events'; break;
              case 'sponsored': linkPrefix = '/sponsored'; break;
              case 'music_show': linkPrefix = '/music/shows'; break;
              default: linkPrefix = '';
            }
            return { ...item, link: `${linkPrefix}/${item.link_slug}` };
          }));
        }
      } catch (err) {
        console.error("Failed to fetch latest content:", err);
        setError("Failed to load latest content. Please try again later.");
        // Fallback to dummy content on error
        setLatestItems(allDummyContent.slice(0, 6).map(item => {
          let linkPrefix = '';
          switch (item.type) {
            case 'show': linkPrefix = '/shows'; break;
            case 'video': linkPrefix = '/watch'; break;
            case 'article': linkPrefix = '/news'; break;
            case 'event': linkPrefix = '/events'; break;
            case 'sponsored': linkPrefix = '/sponsored'; break;
            case 'music_show': linkPrefix = '/music/shows'; break;
            default: linkPrefix = '';
          }
          return { ...item, link: `${linkPrefix}/${item.link_slug}` };
        }));
      } finally {
        setLoading(false);
      }
    };

    getLatestContent();
  }, []);

  if (error) {
    return (
      <section className="py-12 bg-background text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 uppercase tracking-tight">Latest Content</h2>
          <p className="text-destructive font-sans">{error}</p>
        </div>
      </section>
    );
  }

  if (latestItems.length === 0 && !loading) {
    return null; // Don't render if no items and not loading
  }

  return (
    <section className="py-12 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">Latest <span className="text-primary">Additions</span></h2>
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
              {latestItems.map((item) => (
                <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <ContentCard
                    type={item.type}
                    title={item.title}
                    description={item.description}
                    imageUrl={item.image_url}
                    category={item.category}
                    link={item.link}
                    contentId={item.id} // Added contentId prop
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary" />
            <CarouselNext className="right-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary" />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default LatestContentCarousel;