import { supabase } from './supabaseClient';
import { ContentItem } from './content'; // Import ContentItem for nested content

// Interface for user progress data
export interface UserProgress {
  id?: string;
  user_id: string;
  content_id: string;
  content_type: string;
  progress_data?: {
    time?: number; // For videos
    percentage?: number; // For articles
  };
  last_viewed_at?: string;
  content?: ContentItem; // Nested content details
}

// Function to save or update user progress
export const saveUserProgress = async (progress: UserProgress) => {
  const { user_id, content_id, content_type, progress_data } = progress;

  const { data: existingProgress, error: fetchError } = await supabase
    .from('user_progress')
    .select('id')
    .eq('user_id', user_id)
    .eq('content_id', content_id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error checking existing progress:', fetchError);
    throw fetchError;
  }

  if (existingProgress) {
    const { data, error } = await supabase
      .from('user_progress')
      .update({ progress_data, last_viewed_at: new Date().toISOString() })
      .eq('id', existingProgress.id)
      .select();
    if (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
    return data;
  } else {
    const { data, error } = await supabase
      .from('user_progress')
      .insert({ user_id, content_id, content_type, progress_data })
      .select();
    if (error) {
      console.error('Error inserting user progress:', error);
      throw error;
    }
    return data;
  }
};

// Function to fetch user progress
export const fetchUserProgress = async (userId: string, limit: number = 5) => {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      content:content_id (
        id, title, description, image_url, category, link_slug, type, video_url, image_gallery_urls, music_embed_url, creator_id, profiles(full_name)
      )
    `)
    .eq('user_id', userId)
    .order('last_viewed_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
  const mappedData = data?.map(progressItem => ({
    ...progressItem,
    content: progressItem.content ? {
      ...progressItem.content,
      creator_name: (progressItem.content as any).profiles?.full_name || null,
    } as ContentItem : null,
  })) as UserProgress[];
  return mappedData;
};