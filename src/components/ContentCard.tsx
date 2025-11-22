"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, BookOpen, CalendarDays, Share2 } from "lucide-react"; // Added Share2 icon
import { Button } from "@/components/ui/button"; // Import Button
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Import Popover components

interface ContentCardProps {
  type: "show" | "video" | "article" | "event";
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  link: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  type,
  title,
  description,
  imageUrl,
  category,
  link,
}) => {
  const getIcon = () => {
    switch (type) {
      case "show":
      case "video":
        return <PlayCircle className="h-4 w-4 mr-1" />;
      case "article":
        return <BookOpen className="h-4 w-4 mr-1" />;
      case "event":
        return <CalendarDays className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const shareUrl = `${window.location.origin}${link}`;
  const shareText = `Check out this ${type} on MonoKromatik Network: ${title}`;

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-neutral-900 text-white border-neutral-800">
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white uppercase text-xs px-2 py-1">
          {category}
        </Badge>
      </div>
      <CardHeader className="p-4 pb-2 flex-grow">
        <CardTitle className="text-xl font-bold leading-tight line-clamp-2">
          <a href={link} className="hover:text-red-500 transition-colors">
            {title}
          </a>
        </CardTitle>
        <p className="text-sm text-gray-400 line-clamp-3 mt-2">{description}</p>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <a href={link} className="inline-flex items-center text-red-500 hover:text-red-400 text-sm font-semibold transition-colors">
          {getIcon()}
          Read More
        </a>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2">
            <div className="flex flex-col space-y-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md"
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.814L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md"
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.24.195 2.24.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z"></path></svg>
                Facebook
              </a>
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;