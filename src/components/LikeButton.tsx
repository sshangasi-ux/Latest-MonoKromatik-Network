"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { addLike, removeLike, getLikeCount, hasUserLiked } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils"; // Added missing import

interface LikeButtonProps {
  contentId: string;
  initialLikes?: number; // Optional initial like count for display
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ contentId, initialLikes = 0, className }) => {
  const { user, isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!isAuthenticated || !user || !contentId) {
        setLiked(false);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const userHasLiked = await hasUserLiked(user.id, contentId);
        setLiked(userHasLiked);
      } catch (err) {
        console.error("Failed to check like status:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCount = async () => {
      try {
        const count = await getLikeCount(contentId);
        setLikeCount(count);
      } catch (err) {
        console.error("Failed to fetch like count:", err);
      }
    };

    checkLikeStatus();
    fetchCount();
  }, [isAuthenticated, user, contentId]);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if this is inside a Link
    e.stopPropagation(); // Stop event propagation

    if (!isAuthenticated || !user) {
      toast.info("Please log in to like content.");
      return;
    }

    setLoading(true);
    try {
      if (liked) {
        await removeLike(user.id, contentId);
        setLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
        toast.info("Like removed.");
      } else {
        const result = await addLike(user.id, contentId);
        if (result) { // Only update if a new like was actually added (not a duplicate)
          setLiked(true);
          setLikeCount(prev => prev + 1);
          toast.success("Content liked!");
        }
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
      toast.error("Failed to update like status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleLike}
      disabled={loading || !isAuthenticated}
      className={cn(
        "rounded-full bg-background/60 hover:bg-background/80 backdrop-blur-sm flex items-center justify-center space-x-1",
        className
      )}
      aria-label={liked ? "Unlike content" : "Like content"}
    >
      <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
      {likeCount > 0 && <span className="text-xs text-foreground">{likeCount}</span>}
    </Button>
  );
};

export default LikeButton;