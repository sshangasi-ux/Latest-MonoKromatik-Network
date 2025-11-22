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
import { videoSpotlights } from "../data/content"; // Updated import path

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
          <CarouselPrevious className="left-4 bg-neutral-800 text-white hover:bg-neutral-700" />
          <CarouselNext className="right-4 bg-neutral-800 text-white hover:bg-neutral-700" />
        </Carousel>
      </div>
    </section>
  );
};

export default VideoSpotlightCarousel;