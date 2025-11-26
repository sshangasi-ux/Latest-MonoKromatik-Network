"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Lock } from "lucide-react";
import { ContentItem } from "@/hooks/useContentDetail"; // Import ContentItem from the new hook

interface ContentMediaProps {
  contentItem: ContentItem;
  isPremiumContent: boolean;
  canAccessContent: boolean;
  isAuthenticated: boolean;
}

const ContentMedia: React.FC<ContentMediaProps> = ({
  contentItem,
  isPremiumContent,
  canAccessContent,
  isAuthenticated,
}) => {
  if (isPremiumContent && !canAccessContent) {
    return (
      <div className="relative w-full h-64 md:h-96 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <img
          src={contentItem.image_url}
          alt={contentItem.title}
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
        />
        <div className="relative z-10 text-center p-4">
          <Lock className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-heading font-bold text-foreground mb-2 uppercase tracking-tight">
            Membership Required
          </h2>
          <p className="text-lg text-muted-foreground mb-6 font-sans">
            This content is exclusive to our premium members.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
            <Link to="/membership">Upgrade Your Plan</Link>
          </Button>
          {!isAuthenticated && (
            <p className="text-muted-foreground text-sm mt-4 font-sans">
              Already a member?{" "}
              <Link to="/login" className="text-primary hover:underline">Log in</Link>
            </p>
          )}
        </div>
      </div>
    );
  }

  if (contentItem.type === "video" && contentItem.video_url) {
    return (
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={contentItem.video_url}
          title={contentItem.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    );
  }

  if ((contentItem.type === "article" || contentItem.type === "show" || contentItem.type === "sponsored" || contentItem.type === "music_show") && contentItem.image_gallery_urls && contentItem.image_gallery_urls.length > 1) {
    return (
      <Carousel className="w-full">
        <CarouselContent>
          {contentItem.image_gallery_urls.map((imgUrl, index) => (
            <CarouselItem key={index}>
              <img
                src={imgUrl}
                alt={`${contentItem.title} - Gallery Image ${index + 1}`}
                className="w-full h-64 object-cover md:h-96"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary" />
        <CarouselNext className="right-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary" />
      </Carousel>
    );
  }

  return (
    <img
      src={contentItem.image_url}
      alt={contentItem.title}
      className="w-full h-64 object-cover md:h-96"
    />
  );
};

export default ContentMedia;