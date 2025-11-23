"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchContent, fetchContentBySlugAndType } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Heart } from "lucide-react"; // Import Heart icon
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ContentCard from "@/components/ContentCard";
import { allDummyContent } from "@/data/dummyContent";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event";
  full_content?: string;
  link: string;
  video_url?: string; // Added video_url to interface
}

const ContentDetailPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [contentItem, setContentItem] = useState<ContentItem | undefined>(undefined);
  const [relatedContent, setRelatedContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
      setError(null);
      try {
        let actualContentType: "show" | "video" | "article" | "event" | undefined;
        switch (type) {
          case 'news': actualContentType = 'article'; break;
          case 'watch': actualContentType = 'video'; break;
          case 'shows': actualContentType = 'show'; break;
          case 'events': actualContentType = 'event'; break;
          default: actualContentType = undefined;
        }

        if (!actualContentType || !id) {
          setError("Invalid content type or ID.");
          setLoading(false);
          return;
        }

        const fetchedItem = await fetchContentBySlugAndType(id, actualContentType);
        if (fetchedItem) {
          let linkPrefix = '';
          switch (fetchedItem.type) {
            case 'show': linkPrefix = '/shows'; break;
            case 'video': linkPrefix = '/watch'; break;
            case 'article': linkPrefix = '/news'; break;
            case 'event': linkPrefix = '/events'; break;
            default: linkPrefix = '';
          }
          setContentItem({ ...fetchedItem, link: `${linkPrefix}/${fetchedItem.link_slug}` });

          const { data: allContentData } = await fetchContent(undefined, 10); 
          const mappedAllContent: ContentItem[] = (allContentData as ContentItem[]).map(item => {
            let relatedLinkPrefix = '';
            switch (item.type) {
              case 'show': relatedLinkPrefix = '/shows'; break;
              case 'video': relatedLinkPrefix = '/watch'; break;
              case 'article': relatedLinkPrefix = '/news'; break;
              case 'event': relatedLinkPrefix = '/events'; break;
              default: relatedLinkPrefix = '';
            }
            return { ...item, link: `${relatedLinkPrefix}/${item.link_slug}` };
          });

          const filteredRelated = mappedAllContent.filter(
            (item) =>
              item.category === fetchedItem.category && item.id !== fetchedItem.id
          ).slice(0, 3);
          setRelatedContent(filteredRelated);

        } else {
          setContentItem(undefined);
        }
      } catch (err) {
        console.error("Failed to fetch content detail:", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchContentData();
  }, [type, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Header />
        <main className="flex-grow container mx-auto p-8">
          <div className="bg-neutral-900 rounded-lg shadow-lg overflow-hidden border border-neutral-800">
            <div className="w-full h-64 md:h-96 bg-neutral-800 animate-pulse"></div>
            <div className="p-6">
              <div className="h-6 w-24 bg-neutral-700 rounded mb-4 animate-pulse"></div>
              <div className="h-10 w-3/4 bg-neutral-700 rounded mb-4 animate-pulse"></div>
              <div className="h-6 w-full bg-neutral-800 rounded mb-6 animate-pulse"></div>
              <div className="h-6 w-5/6 bg-neutral-800 rounded mb-8 animate-pulse"></div>
              <div className="h-40 w-full bg-neutral-800 rounded animate-pulse"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Header />
        <main className="flex-grow container mx-auto p-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">Error</h1>
          <p className="text-xl text-red-500 mb-4">{error}</p>
          <Link to="/" className="text-red-500 hover:text-red-400 underline">
            Return to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const displayItem = contentItem || allDummyContent.find(item => item.link_slug === id && item.type === (type === 'news' ? 'article' : type === 'watch' ? 'video' : type === 'shows' ? 'show' : type === 'events' ? 'event' : undefined));

  if (!displayItem) {
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

  const relatedContentToDisplay = relatedContent.length > 0 ? relatedContent : allDummyContent.filter(
    (item) => item.category === displayItem.category && item.id !== displayItem.id
  ).slice(0, 3);

  const shareUrl = `${window.location.origin}${displayItem.link}`;
  const shareText = `Check out this ${displayItem.type} on MonoKromatik Network: ${displayItem.title}`;

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <div className="bg-neutral-900 rounded-lg shadow-lg overflow-hidden border border-neutral-800">
          {(displayItem.type === "show" || displayItem.type === "video") && displayItem.video_url ? (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={displayItem.video_url}
                title={displayItem.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <img
              src={displayItem.image_url}
              alt={displayItem.title}
              className="w-full h-64 object-cover md:h-96"
            />
          )}
          <div className="p-6">
            <Badge className="bg-red-600 hover:bg-red-700 text-white uppercase text-sm px-3 py-1 self-start mb-4">
              {displayItem.category}
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-4">
              {displayItem.title}
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              {displayItem.description}
            </p>
            <div className="flex space-x-4 mb-8">
              <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-3 rounded-lg uppercase font-bold transition-colors">
                {displayItem.type === "article" ? "Read Article" : "Watch Now"}
              </Button>
              <Button variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800 text-lg px-6 py-3 rounded-lg uppercase font-bold transition-colors">
                <Heart className="h-5 w-5 mr-2" />
                Like
              </Button>
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

            {displayItem.full_content && (
              <div
                className="prose dark:prose-invert max-w-none text-gray-200 prose-p:text-gray-200 prose-h3:text-white prose-h2:text-white prose-a:text-red-500 hover:prose-a:text-red-400"
                dangerouslySetInnerHTML={{ __html: displayItem.full_content }}
              />
            )}
          </div>
        </div>

        {relatedContentToDisplay.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase">
              More Like This
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedContentToDisplay.map((item) => (
                <ContentCard
                  key={`${item.type}-${item.id}`}
                  type={item.type}
                  title={item.title}
                  description={item.description}
                  imageUrl={item.image_url}
                  category={item.category}
                  link={item.link}
                />
              ))}
            </div>
          </section>
        )}

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