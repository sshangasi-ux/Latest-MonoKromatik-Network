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

const videoSpotlights = [
  {
    id: "1",
    title: "Afrobeat Rising: The Global Impact",
    description: "A documentary exploring how Afrobeat conquered the world stage.",
    imageUrl: "https://via.placeholder.com/400x250/1F1F1F/FFFFFF?text=Afrobeat+Doc",
    category: "Music",
    link: "/watch/afrobeat-rising",
  },
  {
    id: "2",
    title: "Street Style Lagos: Fashion Forward",
    description: "Capturing the vibrant and innovative street fashion of Lagos.",
    imageUrl: "https://via.placeholder.com/400x250/C1272D/FFFFFF?text=Lagos+Fashion",
    category: "Fashion",
    link: "/watch/street-style-lagos",
  },
  {
    id: "3",
    title: "Tech Innovators: Silicon Savannah Stories",
    description: "Interviews with the entrepreneurs building Africa's tech future.",
    imageUrl: "https://via.placeholder.com/400x250/3A3A3A/FFFFFF?text=Tech+Interviews",
    category: "Tech",
    link: "/watch/tech-innovators",
  },
  {
    id: "4",
    title: "Wildlife Wonders: Conservation Efforts",
    description: "Discover the incredible wildlife and the heroes protecting them across Africa.",
    imageUrl: "https://via.placeholder.com/400x250/000000/FFFFFF?text=Wildlife+Doc",
    category: "Nature",
    link: "/watch/wildlife-wonders",
  },
  {
    id: "5",
    title: "Art & Soul: Contemporary African Art",
    description: "A journey through the dynamic world of modern African art.",
    imageUrl: "https://via.placeholder.com/400x250/C1272D/FFFFFF?text=African+Art",
    category: "Culture",
    link: "/watch/art-soul",
  },
];

const VideoSpotlightCarousel = () => {
  return (
    <section className="py-12 bg-neutral-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase">Video Spotlight</h2>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {videoSpotlights.map((video) => (
              <CarouselItem key={video.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <ContentCard
                  type="video"
                  title={video.title}
                  description={video.description}
                  imageUrl={video.imageUrl}
                  category={video.category}
                  link={video.link}
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

export default VideoSpotlightCarousel;