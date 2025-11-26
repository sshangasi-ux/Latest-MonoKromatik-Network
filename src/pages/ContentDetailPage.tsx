"use client";

import React from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import CommentSection from "@/components/CommentSection";
import ReviewSection from "@/components/ReviewSection";
import ContentMedia from "@/components/ContentMedia";
import ContentHeader from "@/components/ContentHeader";
import ContentActions from "@/components/ContentActions";
import ContentBody from "@/components/ContentBody";
import { useContentDetail } from "@/hooks/useContentDetail"; // Import the new hook
import { allDummyContent } from "@/data/dummyContent"; // Keep for fallback if hook fails

const ContentDetailPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>(); // Destructure type and id from useParams
  const {
    contentItem,
    relatedContent,
    loading,
    error,
    initialLikes,
    averageRating,
    reviewCount,
    userProgress,
    isPremiumContent,
    canAccessContent,
    isAuthenticated, // Destructure isAuthenticated from the hook
  } = useContentDetail();

  // Fallback to dummy content if contentItem is undefined (e.g., initial load or error)
  const displayItem = contentItem || allDummyContent.find(item => item.link_slug === id && item.type === (type === 'news' ? 'article' : type === 'watch' ? 'video' : type === 'shows' ? 'show' : type === 'events' ? 'event' : type === 'sponsored' ? 'sponsored' : type === 'music/shows' ? 'music_show' : undefined));

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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
          <ContentMedia
            contentItem={displayItem}
            isPremiumContent={isPremiumContent}
            canAccessContent={canAccessContent}
            isAuthenticated={isAuthenticated}
          />

          <div className="p-6">
            <ContentHeader
              contentItem={displayItem}
              averageRating={averageRating}
              reviewCount={reviewCount}
            />

            {canAccessContent && (
              <ContentActions
                contentItem={displayItem}
                initialLikes={initialLikes}
                isAuthenticated={isAuthenticated}
                userProgress={userProgress}
              />
            )}

            <ContentBody contentItem={displayItem} canAccessContent={canAccessContent} />
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
                  requiresMembership={item.requires_membership}
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