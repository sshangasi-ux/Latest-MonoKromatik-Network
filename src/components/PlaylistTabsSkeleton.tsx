"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PlaylistTabsSkeleton: React.FC = () => {
  return (
    <div className="flex justify-center space-x-2 mb-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-32 bg-muted rounded-md" />
      ))}
    </div>
  );
};

export default PlaylistTabsSkeleton;