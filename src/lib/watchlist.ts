import { supabase } from './supabaseClient';
import { ContentItem } from './content'; // Import ContentItem for nested content

// Watchlist Functions
export const addContentToWatchlist = async (userId: string, contentId: string) => {
  const { data, error } = await supabase
    .from('user_watchlist')
    .insert([{ user_id: userId, content_id: contentId }])
    .select();

  if (error) {
    console.error('Error adding content to watchlist:', error);
    throw error;
  }
  return data;
};

export const removeContentFromWatchlist = async (userId: string, contentId: string) => {
  const { error } = await supabase
    .from('user_watchlist')
    .delete()
    .eq('user_id', userId)
    .eq('content_id', contentId);

  if (error) {
    console.error('Error removing content from watchlist:', error);
    throw error;
  }
  return true;
};

export const fetchUserWatchlist = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_watchlist')
    .select(`
      content_id,
      content:content_id (
        id, title, description, image_url, category, link_slug, type, video_url, image_gallery_urls, music_embed_url, creator_id, profiles(full_name)
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user watchlist:', error);
    throw error;
  }
  const mappedData = data?.map(item => ({
    ...item,
    content: item.content ? {
      ...item.content,
      creator_name: (item.content as any).profiles?.full_name || null,
    } as ContentItem : null,
  })) as { content: ContentItem | null }[];
  return mappedData.map(item => item.content).filter(Boolean) as ContentItem[]; // Filter out nulls and cast
};

export const isContentInWatchlist = async (userId: string, contentId: string) => {
  const { data, error } = await supabase
    .from('user_watchlist')
    .select('id')
    .eq('user_id', userId)
    .eq('content_id', contentId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking watchlist status:', error);
    throw error;
  }
  return !!data;
};