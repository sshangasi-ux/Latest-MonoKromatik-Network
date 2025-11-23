"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ContentCardSkeleton: React.FC = () => {
  return (
    <Card className="h-full flex flex-col bg-neutral-900 text-white border-neutral-800 overflow-hidden">
      <Skeleton className="w-full h-48 bg-neutral-800" />
      <CardContent className="p-4 flex-grow flex flex-col">
        <Skeleton className="h-4 w-1/3 bg-neutral-700 mb-2" />
        <Skeleton className="h-6 w-full bg-neutral-700 mb-2" />
        <Skeleton className="h-4 w-5/6 bg-neutral-800 mb-1" />
        <Skeleton className="h-4 w-4/5 bg-neutral-800 flex-grow" />
        <Skeleton className="h-4 w-1/4 bg-neutral-700 mt-4" />
      </CardContent>
    </Card>
  );
};

export default ContentCardSkeleton;