import { supabase } from './supabaseClient';
import { ContentItem } from './content'; // Import ContentItem for nested content

// Interface for a User Playlist
export interface Playlist {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  description?: string | null;
  is_public: boolean;
  cover_image_url?: string | null;
  profiles?: {
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
  content?: ContentItem | null; // Details of the content item
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
    profiles: (playlist as any).profiles && Array.isArray((playlist as any).profiles) && (playlist as any).profiles.length > 0 ? (playlist as any).profiles[0] : null
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
    profiles: (data as any).profiles && Array.isArray((data as any).profiles) && (data as any).profiles.length > 0 ? (data as any).profiles[0] : null
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
        id, title, description, image_url, category, link_slug, type, creator_id, profiles(full_name)
      )
    `)
    .eq('playlist_id', playlistId)
    .order('position', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching playlist items:', error);
    throw error;
  }

  const mappedData: PlaylistItem[] = (data || []).map((item: any) => ({
    id: item.id,
    created_at: item.created_at,
    playlist_id: item.playlist_id,
    content_id: item.content_id,
    position: item.position,
    content: item.content ? {
      ...item.content,
      creator_name: (item.content as any).profiles?.full_name || null,
    } as ContentItem : null,
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