"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Play, BookOpen, Calendar, Star, LinkIcon, User } from "lucide-react"; // Import User icon
import { useWatchlist } from "@/hooks/useWatchlist";
import { cn } from "@/lib/utils";
import AddToPlaylistButton from "./AddToPlaylistButton"; // Import AddToPlaylistButton

interface ContentCardProps {
  contentId: string; // Content ID for watchlist and other unique identification
  type: "show" | "video" | "article" | "event" | "sponsored" | "music_show";
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  link: string; // The actual navigation link
  className?: string;
  creatorId?: string; // New prop for creator's user ID
  creatorName?: string; // New prop for creator's name
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
}) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, userId } = useWatchlist();
  const onWatchlist = isInWatchlist(contentId);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the content detail page
    e.stopPropagation(); // Stop event propagation
    if (!userId) {
      // The hook already shows a toast, but we can add more specific UI here if needed
      return;
    }
    if (onWatchlist) {
      removeFromWatchlist(contentId, title);
    } else {
      addToWatchlist(contentId, title);
    }
  };

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
          <div className="absolute top-2 right-2 flex space-x-2"> {/* Adjusted for multiple buttons */}
            <AddToPlaylistButton contentId={contentId} contentTitle={title} /> {/* Add to Playlist Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleWatchlistToggle}
              className={cn(
                "rounded-full bg-background/60 hover:bg-background/80 backdrop-blur-sm",
                onWatchlist ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-primary"
              )}
            >
              <Heart className="h-5 w-5 fill-current" />
            </Button>
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
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ContentCard;