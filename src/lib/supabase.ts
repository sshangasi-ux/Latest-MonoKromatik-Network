import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided as environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to fetch content from the 'content' table with optional type, limit, offset, and category for pagination and filtering
export const fetchContent = async (type?: string, limit?: number, offset?: number, category?: string) => {
  let query = supabase.from('content').select('*, video_url, image_gallery_urls, music_embed_url', { count: 'exact' }); // Request exact count for pagination and select new fields

  if (type) {
    query = query.eq('type', type);
  }

  if (category && category !== 'all') { // Add category filter if provided and not 'all'
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
  return { data, count }; // Return data and count for pagination
};

// Function to fetch ticker messages from the 'ticker_messages' table
export const fetchTickerMessages = async () => {
  const { data, error } = await supabase
    .from('ticker_messages')
    .select('message')
    .order('created_at', { ascending: false }); // Assuming a 'created_at' column for ordering

  if (error) {
    console.error('Error fetching ticker messages:', error);
    throw error;
  }
  return data.map(item => item.message);
};

// Function to search content by title, description, or category
export const searchContent = async (query: string, limit: number = 5) => {
  if (!query) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from('content')
    .select('*, video_url, image_gallery_urls, music_embed_url') // Select new fields
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Error searching content:', error);
    throw error;
  }
  return { data, error };
};

// New function to fetch a single content item by its link_slug and type
export const fetchContentBySlugAndType = async (slug: string, type: string) => {
  const { data, error } = await supabase
    .from('content')
    .select('*, video_url, image_gallery_urls, music_embed_url') // Select new fields
    .eq('link_slug', slug)
    .eq('type', type)
    .single(); // Use .single() to expect one row

  if (error) {
    console.error(`Error fetching content with slug ${slug} and type ${type}:`, error);
    throw error;
  }
  return data;
};

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
}

// Function to save or update user progress
export const saveUserProgress = async (progress: UserProgress) => {
  const { user_id, content_id, content_type, progress_data } = progress;

  // Check if an entry already exists for this user and content
  const { data: existingProgress, error: fetchError } = await supabase
    .from('user_progress')
    .select('id')
    .eq('user_id', user_id)
    .eq('content_id', content_id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means "no rows found"
    console.error('Error checking existing progress:', fetchError);
    throw fetchError;
  }

  if (existingProgress) {
    // Update existing progress
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
    // Insert new progress
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
        id, title, description, image_url, category, link_slug, type, video_url, image_gallery_urls, music_embed_url
      )
    `)
    .eq('user_id', userId)
    .order('last_viewed_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
  return data;
};

// Interface for Contact Info
export interface ContactInfo {
  id: string;
  email: string;
  phone?: string;
  address?: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
}

// Function to fetch contact information
export const fetchContactInfo = async (): Promise<ContactInfo | null> => {
  const { data, error } = await supabase
    .from('contact_info')
    .select('*')
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means "no rows found"
    console.error('Error fetching contact info:', error);
    throw error;
  }

  return data || null;
};

// New function to update user's preferred categories in user_metadata
export const updateUserPreferredCategories = async (categories: string[]) => {
  const { data, error } = await supabase.auth.updateUser({
    data: { preferred_categories: categories },
  });

  if (error) {
    console.error('Error updating user preferred categories:', error);
    throw error;
  }
  return data.user;
};