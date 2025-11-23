"use client";

import React, { useEffect, useState } from "react"; // Import useEffect and useState
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Calendar, Star, LinkIcon, User, MapPin } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { cn } from "@/lib/utils";
import AddToPlaylistButton from "./AddToPlaylistButton";
import LikeButton from "./LikeButton"; // Import LikeButton
import { getLikeCount } from "@/lib/supabase"; // Import getLikeCount

interface ContentCardProps {
  contentId: string;
  type: "show" | "video" | "article" | "event" | "sponsored" | "music_show";
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  link: string;
  className?: string;
  creatorId?: string;
  creatorName?: string;
  region?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  contentId,
  type,
  title,
  description,
  imageUrl,
  category,
  link,
  className,
  creatorId,
  creatorName,
  region,
}) => {
  const { userId } = useWatchlist(); // Only need userId for watchlist button
  const [initialLikes, setInitialLikes] = useState(0);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const count = await getLikeCount(contentId);
        setInitialLikes(count);
      } catch (err) {
        console.error("Failed to fetch initial like count for card:", err);
      }
    };
    fetchLikes();
  }, [contentId]);

  const renderIcon = () => {
    switch (type) {
      case "video":
      case "show":
        return <Play className="h-4 w-4 mr-1" />;
      case "article":
        return <BookOpen className="h-4 w-4 mr-1" />;
      case "event":
        return <Calendar className="h-4 w-4 mr-1" />;
      case "sponsored":
        return <Star className="h-4 w-4 mr-1" />;
      case "music_show":
        return <Play className="h-4 w-4 mr-1" />;
      default:
        return <LinkIcon className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <Link to={link} className={cn("block h-full", className)}>
      <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"; // Fallback image
            }}
          />
          <div className="absolute top-2 right-2 flex space-x-2">
            <AddToPlaylistButton contentId={contentId} contentTitle={title} />
            <LikeButton contentId={contentId} initialLikes={initialLikes} /> {/* Integrate LikeButton */}
          </div>
          <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full capitalize">
            {category}
          </span>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground capitalize">{type.replace('_', ' ')}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow text-sm text-foreground line-clamp-3">
          {description}
        </CardContent>
        <CardFooter className="pt-2 flex flex-col items-start space-y-2">
          <Button variant="secondary" size="sm" className="w-full">
            {renderIcon()}
            View Details
          </Button>
          {creatorId && creatorName && (
            <Button asChild variant="link" size="sm" className="w-full justify-start p-0 h-auto text-muted-foreground hover:text-primary">
              <Link to={`/creators/${creatorId}`} className="flex items-center text-xs uppercase font-semibold">
                <User className="h-3 w-3 mr-1" />
                By {creatorName}
              </Link>
            </Button>
          )}
          {region && (
            <div className="flex items-center text-xs text-muted-foreground font-sans mt-1">
              <MapPin className="h-3 w-3 mr-1" /> {region}
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ContentCard;