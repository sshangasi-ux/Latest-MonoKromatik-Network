"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import { useAuth } from "@/context/AuthContext";
import { fetchWatchlist, WatchlistItem } from "@/lib/supabase";
import { Link, useNavigate } from "react-router-dom";

const WatchlistPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    const getWatchlist = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const fetchedWatchlist = await fetchWatchlist(user.id);
        const mappedWatchlist = fetchedWatchlist.map(item => ({
          ...item,
          content: {
            ...item.content,
            link: `/${item.content.type === 'article' ? 'news' : item.content.type === 'video' ? 'watch' : item.content.type === 'show' ? 'shows' : item.content.type === 'event' ? 'events' : item.content.type === 'sponsored' ? 'sponsored' : item.content.type === 'music_show' ? 'music/shows' : ''}/${item.content.link_slug}`
          }
        }));
        setWatchlistItems(mappedWatchlist);
      } catch (err) {
        console.error("Failed to fetch watchlist:", err);
        setError("Failed to load your watchlist. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getWatchlist();
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated) {
    return null; // Or a loading spinner, as redirect happens in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">
          My Watchlist
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <p className="text-destructive text-center font-sans">{error}</p>
        ) : watchlistItems.length === 0 ? (
          <p className="text-muted-foreground text-center text-xl font-sans">
            Your watchlist is empty. Start adding content you want to save!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlistItems.map((item) => (
              <ContentCard
                key={item.id}
                type={item.content.type}
                title={item.content.title}
                description={item.content.description}
                imageUrl={item.content.image_url}
                category={item.content.category}
                link={item.content.link}
                contentId={item.content.id}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WatchlistPage;