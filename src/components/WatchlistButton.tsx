"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { addWatchlistItem, removeWatchlistItem, checkWatchlistStatus } from "@/lib/supabase";
import { toast } from "sonner";

interface WatchlistButtonProps {
  contentId: string;
  contentType: "show" | "video" | "article" | "event" | "sponsored" | "music_show";
  className?: string;
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({ contentId, contentType, className }) => {
  const { user, isAuthenticated } = useAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (!isAuthenticated || !user || !contentId) {
        setIsInWatchlist(false);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const status = await checkWatchlistStatus(user.id, contentId);
        setIsInWatchlist(status);
      } catch (err) {
        console.error("Failed to check watchlist status:", err);
        setIsInWatchlist(false); // Assume not in watchlist on error
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, [isAuthenticated, user, contentId]);

  const handleToggleWatchlist = async () => {
    if (!isAuthenticated || !user) {
      toast.info("Please log in to manage your watchlist.");
      return;
    }

    setLoading(true);
    try {
      if (isInWatchlist) {
        await removeWatchlistItem(user.id, contentId);
        setIsInWatchlist(false);
        toast.success(`Removed from ${contentType} watchlist!`);
      } else {
        await addWatchlistItem(user.id, contentId);
        setIsInWatchlist(true);
        toast.success(`Added to ${contentType} watchlist!`);
      }
    } catch (err) {
      console.error("Failed to toggle watchlist item:", err);
      toast.error("Failed to update watchlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.preventDefault(); // Prevent navigating if this is inside a Link
        e.stopPropagation(); // Stop event propagation
        handleToggleWatchlist();
      }}
      disabled={loading || !isAuthenticated}
      className={`text-muted-foreground hover:text-primary hover:bg-transparent ${className}`}
      aria-label={isInWatchlist ? `Remove ${contentType} from watchlist` : `Add ${contentType} to watchlist`}
    >
      <Heart className={`h-6 w-6 ${isInWatchlist ? "fill-primary text-primary" : "text-muted-foreground"}`} />
    </Button>
  );
};

export default WatchlistButton;