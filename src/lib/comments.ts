import { supabase } from './supabaseClient';

// Interface for a Comment
export interface Comment {
  id: string;
  created_at: string;
  user_id: string;
  content_id: string;
  comment_text: string;
  parent_comment_id?: string | null;
  profiles?: {
    full_name: string;
    avatar_url?: string | null;
  } | null;
}

// Function to fetch comments for a specific content item
export const fetchComments = async (contentId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      created_at,
      user_id,
      content_id,
      comment_text,
      parent_comment_id,
      profiles (full_name, avatar_url)
    `)
    .eq('content_id', contentId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
  return (data || []).map(item => ({
    ...item,
    profiles: (item as any).profiles && Array.isArray((item as any).profiles) && (item as any).profiles.length > 0 ? (item as any).profiles[0] : null
  })) as Comment[];
};

// Function to add a new comment
export const addComment = async (userId: string, contentId: string, commentText: string, parentCommentId?: string) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({ user_id: userId, content_id: contentId, comment_text: commentText, parent_comment_id: parentCommentId })
    .select();

  if (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
  return data[0];
};