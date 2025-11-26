"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  fetchContent,
  fetchContentBySlugAndType,
  saveUserProgress,
  getLikeCount,
  getAverageRating,
  fetchUserProgress,
  ContentItem as SupabaseContentItem, // Rename to avoid conflict
} from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { allDummyContent } from "@/data/dummyContent";

// Re-export ContentItem from lib/supabase for consistency
export type ContentItem = SupabaseContentItem;

interface UseContentDetailResult {
  contentItem: ContentItem | undefined;
  relatedContent: ContentItem[];
  loading: boolean;
  error: string | null;
  initialLikes: number;
  averageRating: number;
  reviewCount: number;
  userProgress: { time?: number; percentage?: number } | null;
  isPremiumContent: boolean;
  canAccessContent: boolean;
  isAuthenticated: boolean; // Added isAuthenticated to the interface
  handleSaveProgress: (progressData: { time?: number; percentage?: number }) => Promise<void>;
}

export const useContentDetail = (): UseContentDetailResult => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const { user, isAuthenticated, userSubscription } = useAuth();
  const [contentItem, setContentItem] = useState<ContentItem | undefined>(undefined);
  const [relatedContent, setRelatedContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLikes, setInitialLikes] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [userProgress, setUserProgress] = useState<{ time?: number; percentage?: number } | null>(null);

  const hasActiveMembership = isAuthenticated && userSubscription?.status === 'active';
  const isPremiumContent = contentItem?.requires_membership || false;
  const canAccessContent = !isPremiumContent || hasActiveMembership;

  const handleSaveProgress = useCallback(async (progressData: { time?: number; percentage?: number }) => {
    if (user && contentItem && canAccessContent) {
      try {
        await saveUserProgress({
          user_id: user.id,
          content_id: contentItem.id,
          content_type: contentItem.type,
          progress_data: progressData,
        });
        setUserProgress(progressData);
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
            setUserProgress(null);
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

  return {
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
    isAuthenticated, // Return isAuthenticated from the hook
    handleSaveProgress,
  };
};