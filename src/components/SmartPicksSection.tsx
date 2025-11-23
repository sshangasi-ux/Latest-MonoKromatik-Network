"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { fetchUserProgress, fetchContent } from "@/lib/supabase";
import ContentCard from "./ContentCard";
import ContentCardSkeleton from "./ContentCardSkeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { allDummyContent } from "@/data/dummyContent"; // Using dummy content as fallback

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event" | "sponsored"; // Added 'sponsored'
  link: string;
}

const SmartPicksSection = () => {
  const { user, isAuthenticated } = useAuth();
  const [recommendedItems, setRecommendedItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        let categories: string[] = [];
        if (isAuthenticated && user) {
          const userProgress = await fetchUserProgress(user.id, 5); // Get recent progress
          const recentCategories = userProgress
            .filter(p => p.content?.category)
            .map(p => p.content.category)
            .filter((value, index, self) => self.indexOf(value) === index); // Unique categories
          categories = recentCategories;
        }

        let fetchedContent: ContentItem[] = [];
        if (categories.length > 0) {
          // Fetch content based on user's preferred categories
          // For simplicity, we'll fetch a general set and filter client-side
          // In a real app, you'd have a more sophisticated backend query
          const { data } = await fetchContent(undefined, 20); // Fetch more content to filter from
          const mappedContent: ContentItem[] = (data as ContentItem[]).map(item => {
            let linkPrefix = '';
            switch (item.type) {
              case 'show': linkPrefix = '/shows'; break;
              case 'video': linkPrefix = '/watch'; break;
              case 'article': linkPrefix = '/news'; break;
              case 'event': linkPrefix = '/events'; break;
              case 'sponsored': linkPrefix = '/sponsored'; break; // Added 'sponsored'
              default: linkPrefix = '';
            }
            return { ...item, link: `${linkPrefix}/${item.link_slug}` };
          });

          // Filter for items in recommended categories, prioritize new items
          const categoryFiltered = mappedContent.filter(item => categories.includes(item.category));
          // Shuffle and take a few
          fetchedContent = categoryFiltered.sort(() => 0.5 - Math.random()).slice(0, 6);

          // If not enough category-specific items, fill with general popular ones
          if (fetchedContent.length < 6) {
            const remaining = 6 - fetchedContent.length;
            const generalPicks = mappedContent.filter(item => !fetchedContent.some(rec => rec.id === item.id))
                                              .sort(() => 0.5 - Math.random())
                                              .slice(0, remaining);
            fetchedContent = [...fetchedContent, ...generalPicks];
          }

        } else {
          // Fallback for non-authenticated users or no progress: general popular content
          const { data } = await fetchContent(undefined, 6);
          fetchedContent = (data as ContentItem[]).map(item => {
            let linkPrefix = '';
            switch (item.type) {
              case 'show': linkPrefix = '/shows'; break;
              case 'video': linkPrefix = '/watch'; break;
              case 'article': linkPrefix = '/news'; break;
              case 'event': linkPrefix = '/events'; break;
              case 'sponsored': linkPrefix = '/sponsored'; break; // Added 'sponsored'
              default: linkPrefix = '';
            }
            return { ...item, link: `${linkPrefix}/${item.link_slug}` };
          });
        }
        setRecommendedItems(fetchedContent);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError("Failed to load smart picks. Please try again later.");
        // Fallback to dummy content on error
        setRecommendedItems(allDummyContent.sort(() => 0.5 - Math.random()).slice(0, 6).map(item => {
          let linkPrefix = '';
          switch (item.type) {
            case 'show': linkPrefix = '/shows'; break;
            case 'video': linkPrefix = '/watch'; break;
            case 'article': linkPrefix = '/news'; break;
            case 'event': linkPrefix = '/events'; break;
            case 'sponsored': linkPrefix = '/sponsored'; break; // Added 'sponsored'
            default: linkPrefix = '';
          }
          return { ...item, link: `${linkPrefix}/${item.link_slug}` };
        }));
      } finally {
        setLoading(false);
      }
    };

    getRecommendations();
  }, [isAuthenticated, user]);

  if (error) {
    return (
      <section className="py-12 bg-background text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 uppercase tracking-tight">Smart Picks for You</h2>
          <p className="text-destructive font-sans">{error}</p>
        </div>
      </section>
    );
  }

  if (recommendedItems.length === 0 && !loading) {
    return null; // Don't render if no recommendations and not loading
  }

  return (
    <section className="py-12 bg-secondary text-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">Smart Picks for You</h2>
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
              {recommendedItems.map((item) => (
                <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <ContentCard
                    type={item.type}
                    title={item.title}
                    description={item.description}
                    imageUrl={item.image_url}
                    category={item.category}
                    link={item.link}
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

export default SmartPicksSection;