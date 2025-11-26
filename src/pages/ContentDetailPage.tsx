"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchContent, fetchContentBySlugAndType, saveUserProgress, getLikeCount, getAverageRating, fetchUserProgress } from "@/lib/supabase"; // Import fetchUserProgress
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, MapPin, Star, User, PlayCircle, Lock } from "lucide-react"; // Import PlayCircle and Lock icon
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
import CommentSection from "@/components/CommentSection";
import WatchlistButton from "@/components/WatchlistButton";
import AddToPlaylistButton from "@/components/AddToPlaylistButton";
import LikeButton from "@/components/LikeButton";
import ReviewSection from "@/components/ReviewSection";
import { Progress } from "@/components/ui/progress"; // Import Progress component

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
  music_embed_url?: string; // Added music_embed_url
  creator_id?: string; // Added creator_id
  creator_name?: string; // Added creator_name
  region?: string;
  requires_membership?: boolean; // Added requires_membership
}

const ContentDetailPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const { user, isAuthenticated, userSubscription } = useAuth(); // Use isAuthenticated and userSubscription
  const [contentItem, setContentItem] = useState<ContentItem | undefined>(undefined);
  const [relatedContent, setRelatedContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLikes, setInitialLikes] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [userProgress, setUserProgress] = useState<{ time?: number; percentage?: number } | null>(null); // New state for user progress

  const hasActiveMembership = isAuthenticated && userSubscription?.status === 'active';
  const isPremiumContent = contentItem?.requires_membership;
  const canAccessContent = !isPremiumContent || hasActiveMembership;

  const handleSaveProgress = useCallback(async (progressData: { time?: number; percentage?: number }) => {
    if (user && contentItem && canAccessContent) { // Only save progress if user can access content
      try {
        await saveUserProgress({
          user_id: user.id,
          content_id: contentItem.id,
          content_type: contentItem.type,
          progress_data: progressData,
        });
        setUserProgress(progressData); // Update local state
      } catch (err) {
        console.error("Failed to save user progress:", err);
      }
    }
  }, [user, contentItem, canAccessContent]);

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
          case 'music/shows': actualContentType = 'music_show'; break;
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

          const likes = await getLikeCount(fullContentItem.id);
          setInitialLikes(likes);

          const { averageRating: avg, reviewCount: count } = await getAverageRating(fullContentItem.id) || { averageRating: 0, reviewCount: 0 };
          setAverageRating(avg);
          setReviewCount(count);

          // Only fetch/save progress if content is accessible
          if (isAuthenticated && user && (!fullContentItem.requires_membership || hasActiveMembership)) {
            const userProgressData = await fetchUserProgress(user.id, 1);
            const currentContentProgress = userProgressData.find(p => p.content_id === fullContentItem.id);
            if (currentContentProgress) {
              setUserProgress(currentContentProgress.progress_data || null);
            } else {
              if (fullContentItem.type === "video") {
                handleSaveProgress({ time: 0 });
              } else if (fullContentItem.type === "article") {
                handleSaveProgress({ percentage: 0 });
              }
            }
          } else {
            setUserProgress(null); // Clear progress if not accessible
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
  }, [type, id, isAuthenticated, user, hasActiveMembership, handleSaveProgress]);

  useEffect(() => {
    if (!contentItem || contentItem.type !== "article" || !isAuthenticated || !user || !canAccessContent) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = window.scrollY;
      const percentage = scrollHeight > 0 ? Math.min(1, scrolled / scrollHeight) : 0;
      handleSaveProgress({ percentage });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [contentItem, isAuthenticated, user, canAccessContent, handleSaveProgress]);


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

  const progressValue = userProgress?.percentage !== undefined
    ? Math.round(userProgress.percentage * 100)
    : userProgress?.time !== undefined && userProgress.time > 0
      ? 10 // Placeholder for video progress, indicating it's started
      : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
          {isPremiumContent && !canAccessContent && (
            <div className="relative w-full h-64 md:h-96 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <img
                src={displayItem.image_url}
                alt={displayItem.title}
                className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
              />
              <div className="relative z-10 text-center p-4">
                <Lock className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-heading font-bold text-foreground mb-2 uppercase tracking-tight">
                  Membership Required
                </h2>
                <p className="text-lg text-muted-foreground mb-6 font-sans">
                  This content is exclusive to our premium members.
                </p>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
                  <Link to="/membership">Upgrade Your Plan</Link>
                </Button>
                {!isAuthenticated && (
                  <p className="text-muted-foreground text-sm mt-4 font-sans">
                    Already a member?{" "}
                    <Link to="/login" className="text-primary hover:underline">Log in</Link>
                  </p>
                )}
              </div>
            </div>
          )}

          {canAccessContent && (
            <>
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
            </>
          )}

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase text-sm px-3 py-1 self-start font-semibold">
                  {displayItem.category}
                </Badge>
                {displayItem.region && (
                  <Badge variant="secondary" className="bg-secondary text-muted-foreground uppercase text-xs px-3 py-1 font-semibold">
                    <MapPin className="h-3 w-3 mr-1" /> {displayItem.region}
                  </Badge>
                )}
                {displayItem.requires_membership && (
                  <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white uppercase text-xs px-3 py-1 self-start font-semibold">
                    <Lock className="h-3 w-3 mr-1" /> Premium
                  </Badge>
                )}
              </div>
              {canAccessContent && (
                <div className="flex space-x-2">
                  {displayItem.id && (
                    <>
                      <AddToPlaylistButton contentId={displayItem.id} contentTitle={displayItem.title} />
                      <WatchlistButton contentId={displayItem.id} contentType={displayItem.type} className="text-lg" />
                      <LikeButton contentId={displayItem.id} initialLikes={initialLikes} />
                    </>
                  )}
                </div>
              )}
            </div>
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4 uppercase tracking-tight">
              {displayItem.title}
            </h1>
            {reviewCount > 0 && (
              <div className="flex items-center space-x-2 text-muted-foreground text-sm mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <span>{averageRating.toFixed(1)} ({reviewCount} reviews)</span>
              </div>
            )}
            {displayItem.creator_id && displayItem.creator_name && (
              <div className="flex items-center space-x-3 mb-6 p-4 bg-secondary rounded-lg border border-border">
                <User className="h-6 w-6 text-primary" />
                <p className="text-foreground font-semibold uppercase text-sm">
                  Creator:{" "}
                  <Link to={`/creators/${displayItem.creator_id}`} className="text-primary hover:underline">
                    {displayItem.creator_name}
                  </Link>
                </p>
              </div>
            )}
            <p className="text-lg text-muted-foreground mb-6 font-sans">
              {displayItem.description}
            </p>
            {canAccessContent && (
              <div className="flex space-x-4 mb-8">
                {isAuthenticated && userProgress && progressValue > 0 && progressValue < 100 ? (
                  <div className="flex flex-col space-y-2 w-full max-w-xs">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
                      <PlayCircle className="h-5 w-5 mr-2" />
                      Continue {displayItem.type === "article" ? "Reading" : "Watching"}
                    </Button>
                    <Progress value={progressValue} className="h-2 bg-muted" indicatorClassName="bg-primary" />
                    <p className="text-xs text-muted-foreground font-sans">
                      {displayItem.type === "article" ? `${progressValue}% Read` : "Started"}
                    </p>
                  </div>
                ) : displayItem.type === "event" ? (
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20"
                    onClick={() => window.open("https://example.com/buy-tickets", "_blank")}
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
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(displayItem.title)}&summary=${encodeURIComponent(displayItem.description)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm hover:bg-muted p-2 rounded-md font-sans"
                      >
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.923-2.063-2.056 0-1.133.92-2.056 2.063-2.056s2.063.923 2.063 2.056c0 1.133-.92 2.056-2.063 2.056zm1.789 13.019H3.548V9h3.588v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.209 24 24 23.227 24 22.271V1.729C24 .774 23.209 0 22.225 0z"/></svg>
                        LinkedIn
                      </a>
                      <a
                        href={`mailto:?subject=${encodeURIComponent(displayItem.title)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`}
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
              </div>
            )}

            {canAccessContent && displayItem.full_content && (
              <div
                className="prose dark:prose-invert max-w-none text-foreground prose-p:text-muted-foreground prose-h3:text-foreground prose-h2:text-foreground prose-a:text-primary hover:prose-a:text-primary/90 font-sans"
                dangerouslySetInnerHTML={{ __html: displayItem.full_content }}
              />
            )}
          </div>
        </div>

        {canAccessContent && displayItem.id && <CommentSection contentId={displayItem.id} />}
        {canAccessContent && displayItem.id && <ReviewSection contentId={displayItem.id} />}

        {relatedContentToDisplay.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center uppercase text-foreground tracking-tight">
              More Like This
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedContentToDisplay.map((item) => (
                <ContentCard
                  key={`${item.type}-${item.id}`}
                  contentId={item.id}
                  type={item.type}
                  title={item.title}
                  description={item.description}
                  imageUrl={item.image_url}
                  category={item.category}
                  link={item.link}
                  region={item.region}
                  requiresMembership={item.requires_membership} // Pass requiresMembership
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