"use client";

import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  featuredShows,
  videoSpotlights,
  recentArticles,
  upcomingEvents,
} from "@/data/content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, CalendarDays, MapPin } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define a union type for all possible content items
type ContentItem =
  | (typeof featuredShows)[0] & { type: "show"; videoUrl?: string }
  | (typeof videoSpotlights)[0] & { type: "video"; videoUrl?: string }
  | (typeof recentArticles)[0] & { type: "article"; fullContent?: string }
  | (typeof upcomingEvents)[0] & { type: "event"; date?: string; location?: string };

const ContentDetailPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();

  let contentItem: ContentItem | undefined;

  switch (type) {
    case "shows":
      contentItem = featuredShows.find((item) => item.id === id) as ContentItem;
      if (contentItem) contentItem.type = "show";
      break;
    case "watch":
      contentItem = videoSpotlights.find((item) => item.id === id) as ContentItem;
      if (contentItem) contentItem.type = "video";
      break;
    case "news":
      contentItem = recentArticles.find((item) => item.id === id) as ContentItem;
      if (contentItem) contentItem.type = "article";
      break;
    case "events":
      contentItem = upcomingEvents.find((item) => item.id === id) as ContentItem;
      if (contentItem) contentItem.type = "event";
      break;
    default:
      contentItem = undefined;
  }

  if (!contentItem) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Header />
        <main className="flex-grow container mx-auto p-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Content Not Found
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            The content you are looking for does not exist.
          </p>
          <Link to="/" className="text-red-500 hover:text-red-400 underline">
            Return to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const shareUrl = `${window.location.origin}${contentItem.link}`;
  const shareText = `Check out this ${contentItem.type} on MonoKromatik Network: ${contentItem.title}`;

  // Use direct type checks in JSX for correct type narrowing
  const isVideoContent = contentItem.type === "show" || contentItem.type === "video";
  const isArticleContent = contentItem.type === "article";
  const isEventContent = contentItem.type === "event";

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <div className="bg-neutral-900 rounded-lg shadow-lg overflow-hidden border border-neutral-800">
          {(contentItem.type === "show" || contentItem.type === "video") && contentItem.videoUrl ? (
            <div className="relative w-full aspect-video bg-black">
              <video
                src={contentItem.videoUrl}
                controls
                className="w-full h-full object-contain"
                poster={contentItem.imageUrl} // Use image as poster
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <img
              src={contentItem.imageUrl}
              alt={contentItem.title}
              className="w-full h-64 object-cover md:h-96"
            />
          )}

          <div className="p-6">
            <Badge className="bg-red-600 hover:bg-red-700 text-white uppercase text-sm px-3 py-1 self-start mb-4">
              {contentItem.category}
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-4">
              {contentItem.title}
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              {contentItem.description}
            </p>

            {contentItem.type === "event" && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 text-gray-300">
                {contentItem.date && (
                  <div className="flex items-center text-lg">
                    <CalendarDays className="h-5 w-5 mr-2 text-red-500" />
                    <span>{contentItem.date}</span>
                  </div>
                )}
                {contentItem.location && (
                  <div className="flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2 text-red-500" />
                    <span>{contentItem.location}</span>
                  </div>
                )}
              </div>
            )}

            {contentItem.type === "article" && contentItem.fullContent && (
              <div
                className="prose dark:prose-invert max-w-none text-gray-200 mb-6 prose-p:text-gray-200 prose-a:text-red-500 hover:prose-a:text-red-400"
                dangerouslySetInnerHTML={{ __html: contentItem.fullContent }}
              />
            )}

            <div className="flex flex-wrap gap-4">
              {(contentItem.type === "show" || contentItem.type === "video") && contentItem.videoUrl && (
                <a href={contentItem.videoUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-3 rounded-lg uppercase font-bold transition-colors">
                    Watch Now
                  </Button>
                </a>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800 text-lg px-6 py-3 rounded-lg uppercase font-bold transition-colors">
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2 bg-neutral-800 border-neutral-700 text-white">
                  <div className="flex flex-col space-y-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm hover:bg-neutral-700 p-2 rounded-md"
                    >
                      <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.814L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                      Twitter
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm hover:bg-neutral-700 p-2 rounded-md"
                    >
                      <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.24.195 2.24.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z"></path></svg>
                      Facebook
                    </a>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link to="/" className="text-red-500 hover:text-red-400 underline">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContentDetailPage;