"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase, addContentToWatchlist, removeContentFromWatchlist, fetchUserWatchlist, isContentInWatchlist } from '@/lib/supabase';
import { toast } from 'sonner';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event" | "sponsored" | "music_show";
  link: string; // Derived link for navigation
}

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const refreshWatchlist = useCallback(async () => {
    if (!userId) {
      setWatchlist([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const items = await fetchUserWatchlist(userId);
      const mappedItems: ContentItem[] = items.map((item: any) => {
        let linkPrefix = '';
        switch (item.type) {
          case 'show': linkPrefix = '/shows'; break;
          case 'video': linkPrefix = '/watch'; break;
          case 'article': linkPrefix = '/news'; break;
          case 'event': linkPrefix = '/events'; break;
          case 'sponsored': linkPrefix = '/sponsored'; break;
          case 'music_show': linkPrefix = '/music/shows'; break;
          default: linkPrefix = '';
        }
        return { ...item, link: `${linkPrefix}/${item.link_slug}` };
      });
      setWatchlist(mappedItems);
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
      toast.error("Failed to load watchlist.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshWatchlist();
  }, [userId, refreshWatchlist]);

  const addToWatchlist = async (contentId: string, contentTitle: string) => {
    if (!userId) {
      toast.error("Please log in to add items to your watchlist.");
      return;
    }
    try {
      await addContentToWatchlist(userId, contentId);
      setWatchlist(prev => [...prev, { id: contentId, title: contentTitle } as ContentItem]); // Optimistic update
      toast.success(`${contentTitle} added to watchlist!`);
      refreshWatchlist(); // Refresh to get full content details
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      toast.error(`Failed to add ${contentTitle} to watchlist.`);
    }
  };

  const removeFromWatchlist = async (contentId: string, contentTitle: string) => {
    if (!userId) {
      toast.error("Please log in to manage your watchlist.");
      return;
    }
    try {
      await removeContentFromWatchlist(userId, contentId);
      setWatchlist(prev => prev.filter(item => item.id !== contentId)); // Optimistic update
      toast.info(`${contentTitle} removed from watchlist.`);
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      toast.error(`Failed to remove ${contentTitle} from watchlist.`);
    }
  };

  const isInWatchlist = useCallback((contentId: string) => {
    return watchlist.some(item => item.id === contentId);
  }, [watchlist]);

  return {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    userId,
    refreshWatchlist,
  };
};