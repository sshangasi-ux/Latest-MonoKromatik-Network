import { supabase } from './supabaseClient';

// Content Item Interface (re-defined here for modularity, but should be consistent)
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event" | "sponsored" | "music_show";
  full_content?: string;
  link: string;
  video_url?: string;
  image_gallery_urls?: string[];
  music_embed_url?: string;
  creator_id?: string;
  creator_name?: string; // Added for direct access
}

// Function to fetch content from the 'content' table with optional type, limit, offset, and category for pagination and filtering
export const fetchContent = async (type?: string, limit?: number, offset?: number, category?: string) => {
  let query = supabase.from('content').select('*, video_url, image_gallery_urls, music_embed_url, creator_id, profiles(full_name)', { count: 'exact' });

  if (type) {
    query = query.eq('type', type);
  }

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (limit !== undefined) {
    const start = offset !== undefined ? offset : 0;
    const end = start + limit - 1;
    query = query.range(start, end);
  }

  const { data, error, count } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
  const mappedData = data?.map(item => ({
    ...item,
    creator_name: (item as any).profiles?.full_name || null,
  })) as ContentItem[]; // Cast to ContentItem[]
  return { data: mappedData, count };
};

// Function to search content by title, description, or category
export const searchContent = async (query: string, limit: number = 5) => {
  if (!query) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from('content')
    .select('*, video_url, image_gallery_urls, music_embed_url, creator_id, profiles(full_name)')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Error searching content:', error);
    throw error;
  }
  const mappedData = data?.map(item => ({
    ...item,
    creator_name: (item as any).profiles?.full_name || null,
  })) as ContentItem[]; // Cast to ContentItem[]
  return { data: mappedData, error };
};

// Function to fetch a single content item by its link_slug and type
export const fetchContentBySlugAndType = async (slug: string, type: string) => {
  const { data, error } = await supabase
    .from('content')
    .select('*, video_url, image_gallery_urls, music_embed_url, creator_id, profiles(full_name)')
    .eq('link_slug', slug)
    .eq('type', type)
    .single();

  if (error) {
    console.error(`Error fetching content with slug ${slug} and type ${type}:`, error);
    throw error;
  }
  const mappedData = data ? { ...data, creator_name: (data as any).profiles?.full_name || null } as ContentItem : null;
  return mappedData;
};