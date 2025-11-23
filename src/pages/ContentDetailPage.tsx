"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchContent, fetchContentBySlugAndType, saveUserProgress } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ContentCard from "@/components/ContentCard";
import { allDummyContent } from "@/data/dummyContent";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAuth } from "@/context/AuthContext";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event" | "sponsored" | "music_show";
  full_content?: string;
  link: string;
  video_url?: string;
  image_gallery_urls?: string[];
}

const ContentDetailPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const { user } = useAuth();
  const [contentItem, setContentItem] = useState<ContentItem | undefined>(undefined);
  const [relatedContent, setRelatedContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSaveProgress = useCallback(async (progressData: any) => {
    if (user && contentItem) {
      try {
        await saveUserProgress({
          user_id: user.id,
          content_id: contentItem.id,
          content_type: contentItem.type,
          progress_data: progressData,
        });
      } catch (err) {
        console.error("Failed to save user progress:", err);
      }
    }
  }, [user, contentItem]);

  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
      setError(null);
      try {
        let actualContentType: "show" | "video" | "article" | "event" | "sponsored" | "music_show" | undefined;
        switch (type) {
          case 'news': actualContentType = 'article'; break;
          case 'watch': actualContentType = 'video'; break;
          case 'shows': actualContentType = 'show'; break;
          case 'events': actualContentType = 'event'; break;
          case 'sponsored': actualContentType = 'sponsored'; break;
          case 'music/shows': actualContentType = 'music_show'; break; // Handle new music show route
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
            case 'sponsored': linkPrefix = '/sponsored'; break;
            case 'music_show': linkPrefix = '/music/shows'; break;
            default: linkPrefix = '';
          }
          const fullContentItem = { ...fetchedItem, link: `${linkPrefix}/${fetchedItem.link_slug}` };
          setContentItem(fullContentItem);

          if (user) {
            if (fullContentItem.type === "video") {
              handleSaveProgress({ time: 0 });
            } else if (fullContentItem.type === "article") {
              handleSaveProgress({ percentage: 0 });
            }
          }

          const { data: allContentData } = await fetchContent(undefined, 10);
          const mappedAllContent: ContentItem[] = (allContentData as ContentItem[]).map(item => {
            let relatedLinkPrefix = '';
            switch (item.type) {
              case 'show': relatedLinkPrefix = '/shows'; break;
              case 'video': relatedLinkPrefix = '/watch'; break;
              case 'article': relatedLinkPrefix = '/news'; break;
              case 'event': relatedLinkPrefix = '/events'; break;
              case 'sponsored': relatedLinkPrefix = '/sponsored'; break;
              case 'music_show': relatedLinkPrefix = '/music/shows'; break;
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
  }, [type, id, user, handleSaveProgress]);

  useEffect(() => {
    if (!contentItem || contentItem.type !== "article" || !user) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = window.scrollY;
      const percentage = scrollHeight > 0 ? Math.min(1, scrolled / scrollHeight) : 0;
      handleSaveProgress({ percentage });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [contentItem, user, handleSaveProgress]);


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-grow container mx-auto p-8">
          <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
            <div className="w-full h-64 md:h-96 bg-muted animate-pulse"></div>
            <div className="p-6">
              <div className="h-6 w-24 bg-muted-foreground rounded mb-4 animate-pulse"></div>
              <div className="h-10 w-3/4 bg-muted-foreground rounded mb-4 animate-pulse"></div>
              <div className="h-6 w-full bg-muted rounded mb-6 animate-pulse"></div>
              <div className="h-6 w-5/6 bg-muted rounded mb-8 animate-pulse"></div>
              <div className="h-40 w-full bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-grow container mx-auto p-8 text-center">
          <h1 className="text-4xl font-heading font-bold mb-4 text-foreground uppercase tracking-tight">Error</h1>
          <p className="text-xl text-destructive mb-4 font-sans">{error}</p>
          <Link to="/" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
            Return to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const displayItem = contentItem || allDummyContent.find(item => item.link_slug === id && item.type === (type === 'news' ? 'article' : type === 'watch' ? 'video' : type === 'shows' ? 'show' : type === 'events' ? 'event' : type === 'sponsored' ? 'sponsored' : type === 'music/shows' ? 'music_show' : undefined));

  if (!displayItem) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-grow container mx-auto p-8 text-center">
          <h1 className="text-4xl font-heading font-bold mb-4 text-foreground uppercase tracking-tight">
            Content Not Found
          </h1>
          <p className="text-xl text-muted-foreground mb-4 font-sans">
            The content you are looking for does not exist.
          </p>
          <Link to="/" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
          {displayItem.type === "video" && displayItem.video_url ? (
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={displayItem.video_url}
                title={displayItem.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          ) : (displayItem.type === "article" || displayItem.type === "show" || displayItem.type === "sponsored" || displayItem.type === "music_show") && displayItem.image_gallery_urls && displayItem.image_gallery_urls.length > 1 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {displayItem.image_gallery_urls.map((imgUrl, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={imgUrl}
                      alt={`${displayItem.title} - Gallery Image ${index + 1}`}
                      className="w-full h-64 object-cover md:h-96"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary" />
              <CarouselNext className="right-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary" />
            </Carousel>
          ) : (
            <img
              src={displayItem.image_url}
              alt={displayItem.title}
              className="w-full h-64 object-cover md:h-96"
            />
          )}
          <div className="p-6">
            <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase text-sm px-3 py-1 self-start mb-4 font-semibold">
              {displayItem.category}
            </Badge>
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4 uppercase tracking-tight">
              {displayItem.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6 font-sans">
              {displayItem.description}
            </p>
            <div className="flex space-x-4 mb-8">
              {displayItem.type === "event" ? (
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20"
                  onClick={() => window.open("https://example.com/buy-tickets", "_blank")} // Placeholder for 3rd party ticket link
                >
                  Buy Tickets
                </Button>
              ) : (
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
                  {displayItem.type === "article" ? "Read Article" : "Watch Now"}
                </Button>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="border-border text-foreground hover:bg-secondary text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2 bg-card border-border text-foreground">
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
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {displayItem.full_content && (
              <div
                className="prose dark:prose-invert max-w-none text-foreground prose-p:text-muted-foreground prose-h3:text-foreground prose-h2:text-foreground prose-a:text-primary hover:prose-a:text-primary/90 font-sans"
                dangerouslySetInnerHTML={{ __html: displayItem.full_content }}
              />
            )}
          </div>
        </div>

        {relatedContentToDisplay.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center uppercase text-foreground tracking-tight">
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
          <Link to="/" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContentDetailPage;