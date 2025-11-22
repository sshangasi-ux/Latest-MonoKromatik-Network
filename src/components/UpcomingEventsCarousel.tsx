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

const upcomingEvents = [
  {
    id: "1",
    title: "AfroTech Summit 2024",
    description: "Join leaders and innovators at Africa's premier technology conference.",
    imageUrl: "https://via.placeholder.com/400x250/1F1F1F/FFFFFF?text=AfroTech+Summit",
    category: "Tech Event",
    link: "/events/afrotech-summit",
  },
  {
    id: "2",
    title: "Pan-African Music Festival",
    description: "A celebration of African music, featuring top artists from across the continent.",
    imageUrl: "https://via.placeholder.com/400x250/C1272D/FFFFFF?text=Music+Festival",
    category: "Music Event",
    link: "/events/music-festival",
  },
  {
    id: "3",
    title: "Lagos Fashion Week",
    description: "Discover the latest trends and designers at the most anticipated fashion event.",
    imageUrl: "https://via.placeholder.com/400x250/3A3A3A/FFFFFF?text=Lagos+Fashion+Week",
    category: "Fashion Event",
    link: "/events/lagos-fashion-week",
  },
  {
    id: "4",
    title: "African Film Showcase",
    description: "Experience compelling stories from African filmmakers.",
    imageUrl: "https://via.placeholder.com/400x250/000000/FFFFFF?text=Film+Showcase",
    category: "Culture Event",
    link: "/events/film-showcase",
  },
  {
    id: "5",
    title: "Sports Gala & Awards Night",
    description: "Honoring the achievements of African athletes and sports personalities.",
    imageUrl: "https://via.placeholder.com/400x250/C1272D/FFFFFF?text=Sports+Gala",
    category: "Sports Event",
    link: "/events/sports-gala",
  },
];

const UpcomingEventsCarousel = () => {
  return (
    <section className="py-12 bg-neutral-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase">Upcoming Events</h2>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {upcomingEvents.map((event) => (
              <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <ContentCard
                  type="event"
                  title={event.title}
                  description={event.description}
                  imageUrl={event.imageUrl}
                  category={event.category}
                  link={event.link}
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

export default UpcomingEventsCarousel;