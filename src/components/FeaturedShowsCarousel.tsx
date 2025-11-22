"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ContentCard from "./ContentCard";

const featuredShows = [
  {
    id: "1",
    title: "The African Beat: A Music Journey",
    description: "Explore the vibrant rhythms and stories behind Africa's most influential music genres.",
    imageUrl: "https://via.placeholder.com/400x250/C1272D/FFFFFF?text=African+Beat",
    category: "Music",
    link: "/shows/african-beat",
  },
  {
    id: "2",
    title: "Future Forward: Tech Innovations in Africa",
    description: "Dive into the groundbreaking technological advancements shaping the continent's future.",
    imageUrl: "https://via.placeholder.com/400x250/1F1F1F/FFFFFF?text=African+Tech",
    category: "Tech",
    link: "/shows/future-forward",
  },
  {
    id: "3",
    title: "Fashion Frontiers: African Design Unveiled",
    description: "A look at the bold designers and trends defining contemporary African fashion.",
    imageUrl: "https://via.placeholder.com/400x250/3A3A3A/FFFFFF?text=African+Fashion",
    category: "Fashion",
    link: "/shows/fashion-frontiers",
  },
  {
    id: "4",
    title: "Sports Legends: Untold Stories",
    description: "Celebrating the iconic athletes and their impact on African sports history.",
    imageUrl: "https://via.placeholder.com/400x250/000000/FFFFFF?text=Sports+Legends",
    category: "Sports",
    link: "/shows/sports-legends",
  },
  {
    id: "5",
    title: "Culinary Africa: A Taste Tour",
    description: "Journey through the diverse and rich culinary traditions of Africa.",
    imageUrl: "https://via.placeholder.com/400x250/C1272D/FFFFFF?text=African+Food",
    category: "Culture",
    link: "/shows/culinary-africa",
  },
];

const FeaturedShowsCarousel = () => {
  return (
    <section className="py-12 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase">Featured Shows</h2>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {featuredShows.map((show) => (
              <CarouselItem key={show.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <ContentCard
                  type="show"
                  title={show.title}
                  description={show.description}
                  imageUrl={show.imageUrl}
                  category={show.category}
                  link={show.link}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedShowsCarousel;