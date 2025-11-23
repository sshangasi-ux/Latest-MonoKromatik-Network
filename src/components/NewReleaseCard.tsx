"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface NewReleaseCardProps {
  title: string;
  artist: string;
  album: string;
  artworkUrl: string;
  onPlay: () => void; // Function to handle playing the track (e.g., open embed)
}

const NewReleaseCard: React.FC<NewReleaseCardProps> = ({
  title,
  artist,
  album,
  artworkUrl,
  onPlay,
}) => {
  return (
    <Card className="h-full flex flex-col bg-card text-foreground border-border overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20">
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={artworkUrl}
          alt={`${title} by ${artist}`}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="icon"
            className="h-14 w-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110 transition-all"
            onClick={onPlay}
          >
            <Play className="h-8 w-8 fill-current" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="text-xl font-heading font-bold mb-1 line-clamp-2 uppercase tracking-tight">{title}</h3>
        <p className="text-muted-foreground text-sm mb-1 font-sans">
          <span className="font-semibold text-foreground">{artist}</span>
        </p>
        <p className="text-muted-foreground text-xs line-clamp-1 flex-grow font-sans">
          Album: {album}
        </p>
        <Button
          variant="link"
          className="mt-4 p-0 h-auto justify-start text-primary hover:text-primary/90 font-semibold text-sm uppercase font-sans"
          onClick={onPlay}
        >
          Play Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewReleaseCard;