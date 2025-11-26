"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Share2, PlayCircle } from "lucide-react";
import AddToPlaylistButton from "./AddToPlaylistButton";
import WatchlistButton from "./WatchlistButton";
import LikeButton from "./LikeButton";
import { ContentItem } from "@/hooks/useContentDetail"; // Import ContentItem from the new hook
import { Progress } from "@/components/ui/progress"; // Import Progress component

interface ContentActionsProps {
  contentItem: ContentItem;
  initialLikes: number;
  isAuthenticated: boolean;
  userProgress: { time?: number; percentage?: number } | null;
}

const ContentActions: React.FC<ContentActionsProps> = ({
  contentItem,
  initialLikes,
  isAuthenticated,
  userProgress,
}) => {
  const shareUrl = `${window.location.origin}${contentItem.link}`;
  const shareText = `Check out this ${contentItem.type} on MonoKromatik Network: ${contentItem.title}`;

  const progressValue = userProgress?.percentage !== undefined
    ? Math.round(userProgress.percentage * 100)
    : userProgress?.time !== undefined && userProgress.time > 0
      ? 10 // Placeholder for video progress, indicating it's started
      : 0;

  return (
    <div className="flex space-x-4 mb-8">
      {isAuthenticated && userProgress && progressValue > 0 && progressValue < 100 ? (
        <div className="flex flex-col space-y-2 w-full max-w-xs">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
            <PlayCircle className="h-5 w-5 mr-2" />
            Continue {contentItem.type === "article" ? "Reading" : "Watching"}
          </Button>
          <Progress value={progressValue} className="h-2 bg-muted" indicatorClassName="bg-primary" />
          <p className="text-xs text-muted-foreground font-sans">
            {contentItem.type === "article" ? `${progressValue}% Read` : "Started"}
          </p>
        </div>
      ) : contentItem.type === "event" ? (
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20"
          onClick={() => window.open("https://example.com/buy-tickets", "_blank")}
        >
          Buy Tickets
        </Button>
      ) : (
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
          {contentItem.type === "article" ? "Read Article" : "Watch Now"}
        </Button>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2 bg-card border-border text-foreground">
          <div className="flex flex-col space-y-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm hover:bg-muted p-2 rounded-md font-sans"
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.814L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm hover:bg-muted p-2 rounded-md font-sans"
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.24.195 2.24.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z"></path></svg>
              Facebook
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm hover:bg-muted p-2 rounded-md font-sans"
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C7.03 2 3 6.03 3 11.04c0 1.74.5 3.37 1.36 4.78L3.02 21l5.38-1.42c1.36.74 2.92 1.14 4.64 1.14 5.01 0 9.04-4.03 9.04-9.04C21.08 6.03 17.05 2 12.04 2zm4.84 14.44c-.19.34-.78.66-1.09.69-.28.03-.66.03-1.03-.15-.37-.19-1.15-.48-1.99-1.23-.84-.75-1.4-1.68-1.68-2.06-.28-.37-.03-.57.2-.78.19-.19.42-.48.6-.72.19-.24.25-.48.12-.72-.12-.24-.78-1.86-1.06-2.55-.28-.69-.57-.57-.78-.57-.19 0-.42-.03-.6-.03-.19 0-.48.06-.72.31-.24.25-.91.88-.91 2.15 0 1.27.93 2.48 1.06 2.67.12.19 1.83 2.8 4.44 3.91 2.61 1.11 2.61.78 3.08.72.47-.06 1.27-.52 1.46-.91.19-.37.19-.69.12-.78-.06-.09-.22-.15-.42-.24z"/></svg>
              WhatsApp
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(contentItem.title)}&summary=${encodeURIComponent(contentItem.description)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm hover:bg-muted p-2 rounded-md font-sans"
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.923-2.063-2.056 0-1.133.92-2.056 2.063-2.056s2.063.923 2.063 2.056c0 1.133-.92 2.056-2.063 2.056zm1.789 13.019H3.548V9h3.588v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.209 24 24 23.227 24 22.271V1.729C24 .774 23.209 0 22.225 0z"/></svg>
              LinkedIn
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(contentItem.title)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm hover:bg-muted p-2 rounded-md font-sans"
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.355l7.992 6.223L20 9.356V18H4z"/></svg>
              Email
            </a>
          </div>
        </PopoverContent>
      </Popover>
      {contentItem.id && (
        <>
          <AddToPlaylistButton contentId={contentItem.id} contentTitle={contentItem.title} />
          <WatchlistButton contentId={contentItem.id} contentType={contentItem.type} className="text-lg" />
          <LikeButton contentId={contentItem.id} initialLikes={initialLikes} />
        </>
      )}
    </div>
  );
};

export default ContentActions;