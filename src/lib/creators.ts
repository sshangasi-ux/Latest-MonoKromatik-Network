import { supabase } from './supabaseClient';
import { ContentItem } from './content'; // Import ContentItem for creator's content

// Interface for a Creator Profile
export interface CreatorProfile {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  bio?: string | null;
  website_url?: string | null;
  social_links?: { [key: string]: string } | null;
  is_creator?: boolean;
}

// New function to fetch a creator's profile
export const fetchCreatorProfile = async (creatorId: string): Promise<CreatorProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, bio, website_url, social_links, is_creator')
    .eq('id', creatorId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching creator profile:', error);
    throw error;
  }
  return data;
};

// New function to fetch content by a specific creator
export const fetchContentByCreator = async (creatorId: string, limit?: number, offset?: number) => {
  let query = supabase.from('content').select('*, video_url, image_gallery_urls, music_embed_url, creator_id, profiles(full_name)', { count: 'exact' });

  query = query.eq('creator_id', creatorId);

  if (limit !== undefined) {
    const start = offset !== undefined ? offset : 0;
    const end = start + limit - 1;
    query = query.range(start, end);
  }

  const { data, error, count } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching content by creator:', error);
    throw error;
  }
  const mappedData = data?.map(item => ({
    ...item,
    creator_name: (item as any).profiles?.full_name || null,
  })) as ContentItem[]; // Cast to ContentItem[]
  return { data: mappedData, count };
};