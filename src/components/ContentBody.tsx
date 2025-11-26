"use client";

import React from "react";
import { ContentItem } from "@/hooks/useContentDetail"; // Import ContentItem from the new hook

interface ContentBodyProps {
  contentItem: ContentItem;
  canAccessContent: boolean;
}

const ContentBody: React.FC<ContentBodyProps> = ({ contentItem, canAccessContent }) => {
  if (!canAccessContent || !contentItem.full_content) {
    return null;
  }

  return (
    <div
      className="prose dark:prose-invert max-w-none text-foreground prose-p:text-muted-foreground prose-h3:text-foreground prose-h2:text-foreground prose-a:text-primary hover:prose-a:text-primary/90 font-sans"
      dangerouslySetInnerHTML={{ __html: contentItem.full_content }}
    />
  );
};

export default ContentBody;