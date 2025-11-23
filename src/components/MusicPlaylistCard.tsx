"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface MusicPlaylistCardProps {
  title: string;
  description: string;
  coverUrl: string;
  genre: string;
  onPlay: () => void; // Function to handle playing the playlist (e.g., open embed)
}

const MusicPlaylistCard: React.FC<MusicPlaylistCardProps> = ({
  title,
  description,
  coverUrl,
  genre,
  onPlay,
}) => {
  return (
    <Card className="h-full flex flex-col bg-card text-foreground border-border overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20">
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={coverUrl}
          alt={title}
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
        <span className="text-primary uppercase text-xs px-2 py-1 self-start mb-2 font-semibold">
          {genre}
        </span>
        <h3 className="text-xl font-heading font-bold mb-2 line-clamp-2 uppercase tracking-tight">{title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-3 flex-grow font-sans">
          {description}
        </p>
        <Button
          variant="link"
          className="mt-4 p-0 h-auto justify-start text-primary hover:text-primary/90 font-semibold text-sm uppercase font-sans"
          onClick={onPlay}
        >
          Listen Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicPlaylistCard;