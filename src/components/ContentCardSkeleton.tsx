"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ContentCardSkeleton: React.FC = () => {
  return (
    <Card className="h-full flex flex-col bg-card text-foreground border-border overflow-hidden">
      <Skeleton className="w-full h-48 bg-muted" />
      <CardContent className="p-4 flex-grow flex flex-col">
        <Skeleton className="h-4 w-1/3 bg-muted-foreground mb-2" />
        <Skeleton className="h-6 w-full bg-muted-foreground mb-2" />
        <Skeleton className="h-4 w-5/6 bg-muted mb-1" />
        <Skeleton className="h-4 w-4/5 bg-muted flex-grow" />
        <Skeleton className="h-4 w-1/4 bg-muted-foreground mt-4" />
      </CardContent>
    </Card>
  );
};

export default ContentCardSkeleton;