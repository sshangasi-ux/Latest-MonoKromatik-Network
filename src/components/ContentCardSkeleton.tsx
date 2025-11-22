"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ContentCardSkeleton = () => {
  return (
    <Card className="w-full h-full flex flex-col overflow-hidden rounded-lg shadow-lg bg-neutral-900 text-white border-neutral-800">
      <div className="relative w-full h-48 overflow-hidden">
        <Skeleton className="w-full h-full bg-neutral-800" />
        <Skeleton className="absolute top-2 left-2 h-6 w-20 rounded-md bg-neutral-700" />
      </div>
      <CardHeader className="p-4 pb-2 flex-grow">
        <Skeleton className="h-6 w-3/4 mb-2 bg-neutral-700" />
        <Skeleton className="h-4 w-full mb-1 bg-neutral-800" />
        <Skeleton className="h-4 w-5/6 bg-neutral-800" />
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <Skeleton className="h-5 w-24 bg-neutral-700" />
        <Skeleton className="h-8 w-8 rounded-full bg-neutral-700" />
      </CardFooter>
    </Card>
  );
};

export default ContentCardSkeleton;