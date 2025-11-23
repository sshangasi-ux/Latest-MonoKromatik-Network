"use client";

import React from "react";

interface MusicPlayerEmbedProps {
  embedUrl: string;
  title: string;
  height?: string; // e.g., "80", "152", "380"
  width?: string; // e.g., "100%"
}

const MusicPlayerEmbed: React.FC<MusicPlayerEmbedProps> = ({
  embedUrl,
  title,
  height = "152", // Default height suitable for Spotify tracks/albums
  width = "100%",
}) => {
  if (!embedUrl) {
    return (
      <div className="bg-muted p-4 rounded-lg text-muted-foreground text-center font-sans">
        No embed URL provided for this music content.
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg border border-border">
      <iframe
        style={{ borderRadius: "12px" }}
        src={embedUrl}
        width={width}
        height={height}
        frameBorder="0"
        allowFullScreen={false}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title={title}
      ></iframe>
    </div>
  );
};

export default MusicPlayerEmbed;