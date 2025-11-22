"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, BookOpen, CalendarDays } from "lucide-react";

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
      </CardFooter>
    </Card>
  );
};

export default ContentCard;