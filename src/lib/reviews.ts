import { supabase } from './supabaseClient';

export interface Review {
  id: string;
  created_at: string;
  user_id: string;
  content_id: string;
  rating: number;
  review_text: string | null;
  profiles?: {
    full_name: string;
    avatar_url?: string | null;
  } | null;
}

/**
 * Fetches reviews for a specific content item.
 * Includes profile information of the reviewer.
 */
export const fetchReviews = async (contentId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('content_reviews')
    .select(`
      id,
      created_at,
      user_id,
      content_id,
      rating,
      review_text,
      profiles (full_name, avatar_url)
    `)
    .eq('content_id', contentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    profiles: (item as any).profiles && Array.isArray((item as any).profiles) && (item as any).profiles.length > 0 ? (item as any).profiles[0] : null
  })) as Review[];
};

/**
 * Submits a new review for a content item.
 */
export const submitReview = async (userId: string, contentId: string, rating: number, reviewText: string | null) => {
  const { data, error } = await supabase
    .from('content_reviews')
    .insert({ user_id: userId, content_id: contentId, rating, review_text: reviewText })
    .select()
    .single();

  if (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
  return data;
};

/**
 * Fetches a user's existing review for a specific content item.
 */
export const fetchUserReview = async (userId: string, contentId: string): Promise<Review | null> => {
  const { data, error } = await supabase
    .from('content_reviews')
    .select(`
      id,
      created_at,
      user_id,
      content_id,
      rating,
      review_text,
      profiles (full_name, avatar_url)
    `)
    .eq('user_id', userId)
    .eq('content_id', contentId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error('Error fetching user review:', error);
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    profiles: (data as any).profiles && Array.isArray((data as any).profiles) && (data as any).profiles.length > 0 ? (data as any).profiles[0] : null
  } as Review;
};

/**
 * Updates an existing review.
 */
export const updateReview = async (reviewId: string, rating: number, reviewText: string | null) => {
  const { data, error } = await supabase
    .from('content_reviews')
    .update({ rating, review_text: reviewText, created_at: new Date().toISOString() }) // Update created_at to reflect last edit
    .eq('id', reviewId)
    .select()
    .single();

  if (error) {
    console.error('Error updating review:', error);
    throw error;
  }
  return data;
};

/**
 * Deletes a review.
 */
export const deleteReview = async (reviewId: string) => {
  const { error } = await supabase
    .from('content_reviews')
    .delete()
    .eq('id', reviewId);

  if (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
  return true;
};

/**
 * Calculates the average rating and total review count for a content item.
 */
export const getAverageRating = async (contentId: string): Promise<{ averageRating: number; reviewCount: number } | null> => {
  const { data, error, count } = await supabase
    .from('content_reviews')
    .select('rating', { count: 'exact' })
    .eq('content_id', contentId);

  if (error) {
    console.error('Error fetching ratings for average:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return { averageRating: 0, reviewCount: 0 };
  }

  const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / data.length;

  return { averageRating, reviewCount: count || 0 };
};