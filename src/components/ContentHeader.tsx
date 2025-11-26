"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, User, Lock } from "lucide-react";
import { ContentItem } from "@/hooks/useContentDetail"; // Import ContentItem from the new hook

interface ContentHeaderProps {
  contentItem: ContentItem;
  averageRating: number;
  reviewCount: number;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({
  contentItem,
  averageRating,
  reviewCount,
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase text-sm px-3 py-1 self-start font-semibold">
            {contentItem.category}
          </Badge>
          {contentItem.region && (
            <Badge variant="secondary" className="bg-secondary text-muted-foreground uppercase text-xs px-3 py-1 font-semibold">
              <MapPin className="h-3 w-3 mr-1" /> {contentItem.region}
            </Badge>
          )}
          {contentItem.requires_membership && (
            <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white uppercase text-xs px-3 py-1 self-start font-semibold">
              <Lock className="h-3 w-3 mr-1" /> Premium
            </Badge>
          )}
        </div>
      </div>
      <h1 className="text-4xl font-heading font-bold text-foreground mb-4 uppercase tracking-tight">
        {contentItem.title}
      </h1>
      {reviewCount > 0 && (
        <div className="flex items-center space-x-2 text-muted-foreground text-sm mb-4">
          <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
            ))}
          </div>
          <span>{averageRating.toFixed(1)} ({reviewCount} reviews)</span>
        </div>
      )}
      {contentItem.creator_id && contentItem.creator_name && (
        <div className="flex items-center space-x-3 mb-6 p-4 bg-secondary rounded-lg border border-border">
          <User className="h-6 w-6 text-primary" />
          <p className="text-foreground font-semibold uppercase text-sm">
            Creator:{" "}
            <Link to={`/creators/${contentItem.creator_id}`} className="text-primary hover:underline">
              {contentItem.creator_name}
            </Link>
          </p>
        </div>
      )}
      <p className="text-lg text-muted-foreground mb-6 font-sans">
        {contentItem.description}
      </p>
    </>
  );
};

export default ContentHeader;