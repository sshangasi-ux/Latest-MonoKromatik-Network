import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided as environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// Function to fetch content from the 'content' table with optional type, limit, offset, and category for pagination and filtering
export const fetchContent = async (type?: string, limit?: number, offset?: number, category?: string) => {
  let query = supabase.from('content').select('*, video_url, image_gallery_urls, music_embed_url, creator_id, profiles(full_name)', { count: 'exact' }); // Request exact count for pagination and select new fields, including creator info

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
  // Map data to include creator_name directly
  const mappedData = data?.map(item => ({
    ...item,
    creator_name: item.profiles?.full_name || null,
  }));
  return { data: mappedData, count }; // Return data and count for pagination
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
    .select('*, video_url, image_gallery_urls, music_embed_url, creator_id, profiles(full_name)') // Select new fields, including creator info
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Error searching content:', error);
    throw error;
  }
  // Map data to include creator_name directly
  const mappedData = data?.map(item => ({
    ...item,
    creator_name: item.profiles?.full_name || null,
  }));
  return { data: mappedData, error };
};

// New function to fetch a single content item by its link_slug and type
export const fetchContentBySlugAndType = async (slug: string, type: string) => {
  const { data, error } = await supabase
    .from('content')
    .select('*, video_url, image_gallery_urls, music_embed_url, creator_id, profiles(full_name)') // Select new fields, including creator info
    .eq('link_slug', slug)
    .eq('type', type)
    .single(); // Use .single() to expect one row

  if (error) {
    console.error(`Error fetching content with slug ${slug} and type ${type}:`, error);
    throw error;
  }
  // Map data to include creator_name directly
  const mappedData = data ? { ...data, creator_name: data.profiles?.full_name || null } : null;
  return mappedData;
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
  // Map data to include creator_name directly in content object
  const mappedData = data?.map(progressItem => ({
    ...progressItem,
    content: progressItem.content ? {
      ...progressItem.content,
      creator_name: (progressItem.content as any).profiles?.full_name || null,
    } : null,
  }));
  return mappedData;
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
  // Map data to include creator_name directly in content object
  const mappedData = data?.map(item => ({
    ...item,
    content: item.content ? {
      ...item.content,
      creator_name: (item.content as any).profiles?.full_name || null,
    } : null,
  }));
  return mappedData.map(item => item.content); // Return only the content objects
};

export const isContentInWatchlist = async (userId: string, contentId: string) => {
  const { data, error } = await supabase
    .from('user_watchlist')
    .select('id')
    .eq('user_id', userId)
    .eq('content_id', contentId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means "no rows found"
    console.error('Error checking watchlist status:', error);
    throw error;
  }
  return !!data; // Returns true if data exists, false otherwise
};

// Interface for a Comment
export interface Comment {
  id: string;
  created_at: string;
  user_id: string;
  content_id: string;
  comment_text: string;
  parent_comment_id?: string | null;
  profiles?: { // Assuming a 'profiles' table linked by user_id
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
  // Map the data to ensure 'profiles' is a single object or null, not an array
  return (data || []).map(item => ({
    ...item,
    profiles: item.profiles && Array.isArray(item.profiles) && item.profiles.length > 0 ? item.profiles[0] : null
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
    creator_name: item.profiles?.full_name || null,
  }));
  return { data: mappedData, count };
};

// Interface for a User Playlist
export interface Playlist {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  description?: string | null;
  is_public: boolean;
  cover_image_url?: string | null;
  profiles?: { // To get the user's full name for public playlists
    full_name: string;
  } | null;
}

// Interface for a Playlist Item
export interface PlaylistItem {
  id: string;
  created_at: string;
  playlist_id: string;
  content_id: string;
  position?: number | null;
  content?: { // Details of the content item
    id: string;
    title: string;
    description: string;
    image_url: string;
    category: string;
    link_slug: string;
    type: "show" | "video" | "article" | "event" | "sponsored" | "music_show";
  } | null;
}

// Function to create a new playlist
export const createPlaylist = async (userId: string, name: string, description?: string, isPublic: boolean = false, coverImageUrl?: string) => {
  const { data, error } = await supabase
    .from('user_playlists')
    .insert({ user_id: userId, name, description, is_public: isPublic, cover_image_url: coverImageUrl })
    .select()
    .single();

  if (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
  return data;
};

// Function to fetch a user's playlists
export const fetchUserPlaylists = async (userId: string): Promise<Playlist[]> => {
  const { data, error } = await supabase
    .from('user_playlists')
    .select(`
      id,
      created_at,
      user_id,
      name,
      description,
      is_public,
      cover_image_url,
      profiles(full_name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user playlists:', error);
    throw error;
  }
  return (data || []).map(playlist => ({
    ...playlist,
    profiles: playlist.profiles && Array.isArray(playlist.profiles) && playlist.profiles.length > 0 ? playlist.profiles[0] : null
  })) as Playlist[];
};

// Function to fetch a single playlist by ID
export const fetchPlaylistById = async (playlistId: string): Promise<Playlist | null> => {
  const { data, error } = await supabase
    .from('user_playlists')
    .select(`
      id,
      created_at,
      user_id,
      name,
      description,
      is_public,
      cover_image_url,
      profiles(full_name)
    `)
    .eq('id', playlistId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching playlist by ID:', error);
    throw error;
  }
  return data ? {
    ...data,
    profiles: data.profiles && Array.isArray(data.profiles) && data.profiles.length > 0 ? data.profiles[0] : null
  } as Playlist : null;
};

// Function to fetch items within a playlist
export const fetchPlaylistItems = async (playlistId: string): Promise<PlaylistItem[]> => {
  const { data, error } = await supabase
    .from('playlist_items')
    .select(`
      id,
      created_at,
      playlist_id,
      content_id,
      position,
      content:content_id (
        id, title, description, image_url, category, link_slug, type
      )
    `)
    .eq('playlist_id', playlistId)
    .order('position', { ascending: true })
    .order('created_at', { ascending: true }); // Fallback order

  if (error) {
    console.error('Error fetching playlist items:', error);
    throw error;
  }

  // Explicitly map the data to ensure 'content' is treated as a single object or null
  const mappedData: PlaylistItem[] = (data || []).map((item: any) => ({
    id: item.id,
    created_at: item.created_at,
    playlist_id: item.playlist_id,
    content_id: item.content_id,
    position: item.position,
    content: item.content ? { // Ensure content is a single object
      id: item.content.id,
      title: item.content.title,
      description: item.content.description,
      image_url: item.content.image_url,
      category: item.content.category,
      link_slug: item.content.link_slug,
      type: item.content.type,
    } : null,
  }));

  return mappedData;
};

// Function to add content to a playlist
export const addContentToPlaylist = async (playlistId: string, contentId: string, position?: number) => {
  const { data, error } = await supabase
    .from('playlist_items')
    .insert({ playlist_id: playlistId, content_id: contentId, position })
    .select()
    .single();

  if (error) {
    console.error('Error adding content to playlist:', error);
    throw error;
  }
  return data;
};

// Function to remove content from a playlist
export const removeContentFromPlaylist = async (playlistItemId: string) => {
  const { error } = await supabase
    .from('playlist_items')
    .delete()
    .eq('id', playlistItemId);

  if (error) {
    console.error('Error removing content from playlist:', error);
    throw error;
  }
  return true;
};

// Function to check if content is already in a specific playlist
export const isContentInPlaylist = async (playlistId: string, contentId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('playlist_items')
    .select('id')
    .eq('playlist_id', playlistId)
    .eq('content_id', contentId)
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking content in playlist:', error);
    throw error;
  }
  return !!data;
};