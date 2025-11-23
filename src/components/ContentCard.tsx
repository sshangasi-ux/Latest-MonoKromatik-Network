"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  return (
    <Link to={link} className="block h-full">
      <Card className="h-full flex flex-col bg-neutral-900 text-white border-neutral-800 hover:border-red-600 transition-all duration-200 ease-in-out overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <CardContent className="p-4 flex-grow flex flex-col">
          <Badge className="bg-red-600 hover:bg-red-700 text-white uppercase text-xs px-2 py-1 self-start mb-2">
            {category}
          </Badge>
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{title}</h3>
          <p className="text-gray-300 text-sm line-clamp-3 flex-grow">
            {description}
          </p>
          <div className="mt-4 text-red-500 hover:text-red-400 font-semibold text-sm">
            {type === "article" ? "Read More" : "View Details"}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ContentCard;