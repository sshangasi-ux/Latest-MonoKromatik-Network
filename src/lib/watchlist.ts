import { supabase } from './supabaseClient';
import { ContentItem } from './content'; // Import ContentItem for nested content

// Intermediate interface to accurately represent the content object returned by Supabase select
interface SupabaseContentQueryResult extends Omit<ContentItem, 'link' | 'creator_name'> {
  profiles?: { full_name: string }[]; // Supabase returns profiles as an array
}

// Intermediate interface for the item structure within the watchlist fetch
// The error message indicates 'content' is an array of objects, not a single object.
// This is unusual for a direct FK, but we must follow the error.
interface RawSupabaseWatchlistItem {
  content_id: string;
  content: SupabaseContentQueryResult[] | null;
}

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
        id, title, description, image_url, category, link_slug, type, video_url, image_gallery_urls, music_embed_url, creator_id, profiles(full_name), region, requires_membership
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user watchlist:', error);
    throw error;
  }

  // Cast the raw data to the type that TypeScript is inferring
  const rawWatchlistItems = data as RawSupabaseWatchlistItem[];

  const mappedData = rawWatchlistItems?.map((item) => {
    // If item.content is an array, we take the first element.
    // If it's null or empty, we treat it as no content.
    const actualContent = item.content?.[0] || null;

    if (!actualContent) return null;

    // Explicitly construct ContentItem, mapping profiles.full_name to creator_name
    const content: ContentItem = {
      id: actualContent.id,
      title: actualContent.title,
      description: actualContent.description,
      image_url: actualContent.image_url,
      category: actualContent.category,
      link_slug: actualContent.link_slug,
      type: actualContent.type,
      video_url: actualContent.video_url,
      image_gallery_urls: actualContent.image_gallery_urls,
      music_embed_url: actualContent.music_embed_url,
      creator_id: actualContent.creator_id,
      creator_name: actualContent.profiles?.[0]?.full_name || null, // Access the first element of the profiles array
      region: actualContent.region, // Include region
      requires_membership: actualContent.requires_membership, // Include requires_membership
      link: '', // Will be set below
    };

    // Derive the 'link' property based on content type, similar to other places
    let linkPrefix = '';
    switch (content.type) {
      case 'show': linkPrefix = '/shows'; break;
      case 'video': linkPrefix = '/watch'; break;
      case 'article': linkPrefix = '/news'; break;
      case 'event': linkPrefix = '/events'; break;
      case 'sponsored': linkPrefix = '/sponsored'; break;
      case 'music_show': linkPrefix = '/music/shows'; break;
      default: linkPrefix = '';
    }
    content.link = `${linkPrefix}/${content.link_slug}`;

    return content;
  }).filter(Boolean) as ContentItem[]; // Filter out any nulls and cast to ContentItem[]

  return mappedData;
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