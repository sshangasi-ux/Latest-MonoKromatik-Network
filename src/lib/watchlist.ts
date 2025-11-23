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

  const mappedData = data?.map(item => {
    if (!item.content) return null; // Handle cases where content might be null

    // Explicitly construct ContentItem, mapping profiles.full_name to creator_name
    const content: ContentItem = {
      id: item.content.id,
      title: item.content.title,
      description: item.content.description,
      image_url: item.content.image_url,
      category: item.content.category,
      link_slug: item.content.link_slug,
      type: item.content.type,
      video_url: item.content.video_url,
      image_gallery_urls: item.content.image_gallery_urls,
      music_embed_url: item.content.music_embed_url,
      creator_id: item.content.creator_id,
      creator_name: (item.content as any).profiles?.full_name || null,
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