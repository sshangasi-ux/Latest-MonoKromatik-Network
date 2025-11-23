import { supabase } from './supabaseClient';

// Function to add a like to content
export const addLike = async (userId: string, contentId: string) => {
  const { data, error } = await supabase
    .from('content_likes')
    .insert([{ user_id: userId, content_id: contentId }])
    .select();

  if (error) {
    // Handle unique constraint error gracefully (user already liked)
    if (error.code === '23505') { // Unique violation error code
      console.warn(`User ${userId} already liked content ${contentId}.`);
      return null; // Indicate no new like was added
    }
    console.error('Error adding like:', error);
    throw error;
  }
  return data;
};

// Function to remove a like from content
export const removeLike = async (userId: string, contentId: string) => {
  const { error } = await supabase
    .from('content_likes')
    .delete()
    .eq('user_id', userId)
    .eq('content_id', contentId);

  if (error) {
    console.error('Error removing like:', error);
    throw error;
  }
  return true;
};

// Function to get the like count for a content item
export const getLikeCount = async (contentId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('content_likes')
    .select('*', { count: 'exact', head: true })
    .eq('content_id', contentId);

  if (error) {
    console.error('Error fetching like count:', error);
    throw error;
  }
  return count || 0;
};

// Function to check if a user has liked a content item
export const hasUserLiked = async (userId: string, contentId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('content_likes')
    .select('id')
    .eq('user_id', userId)
    .eq('content_id', contentId)
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error('Error checking user like status:', error);
    throw error;
  }
  return !!data;
};