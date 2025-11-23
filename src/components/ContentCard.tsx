"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContentCardProps {
  type: "show" | "video" | "article" | "event" | "sponsored"; // Added 'sponsored'
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
    <Link to={link} className="block h-full group"> {/* Added group for image hover */}
      <Card className="h-full flex flex-col bg-card text-foreground border-border overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20">
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" /> {/* Overlay gradient */}
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase text-xs px-2 py-1 self-start mb-2 font-semibold">
            {category}
          </Badge>
          <h3 className="text-xl font-heading font-bold mb-2 line-clamp-2 uppercase tracking-tight">{title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-3 flex-grow font-sans">
            {description}
          </p>
          <div className="mt-4 text-primary hover:text-primary/90 font-semibold text-sm uppercase font-sans">
            {type === "article" ? "Read More" : "View Details"}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ContentCard;