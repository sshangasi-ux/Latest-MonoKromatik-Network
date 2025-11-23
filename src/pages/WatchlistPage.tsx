"use client";

import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWatchlist } from "@/hooks/useWatchlist";
import ContentCard from "@/components/ContentCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import { Frown } from "lucide-react";

const WatchlistPage: React.FC = () => {
  const { watchlist, loading, userId, refreshWatchlist } = useWatchlist();

  useEffect(() => {
    // Refresh watchlist when the component mounts or userId changes
    refreshWatchlist();
  }, [userId, refreshWatchlist]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-10 text-primary-foreground">Your Watchlist</h1>

        {!userId && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Frown className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">Please log in to view your watchlist.</p>
          </div>
        )}

        {userId && loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        )}

        {userId && !loading && watchlist.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Frown className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">Your watchlist is empty.</p>
            <p className="text-md text-muted-foreground mt-2">Start adding content you love!</p>
          </div>
        )}

        {userId && !loading && watchlist.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlist.map((item) => (
              <ContentCard
                key={item.id}
                contentId={item.id} /* Changed from id={item.id} to contentId={item.id} */
                type={item.type}
                title={item.title}
                description={item.description}
                imageUrl={item.image_url}
                category={item.category}
                link={item.link}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default WatchlistPage;