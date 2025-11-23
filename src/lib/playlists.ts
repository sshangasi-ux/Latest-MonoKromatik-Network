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

// Intermediate interface to accurately represent the content object returned by Supabase select within playlist items
interface SupabasePlaylistItemContentQueryResult extends Omit<ContentItem, 'link' | 'creator_name'> {
  profiles?: { full_name: string }[]; // Supabase returns profiles as an array
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

  const mappedData: PlaylistItem[] = (data || []).map((item: any) => {
    if (!item.content) {
      return {
        id: item.id,
        created_at: item.created_at,
        playlist_id: item.playlist_id,
        content_id: item.content_id,
        position: item.position,
        content: null,
      };
    }

    // Cast item.content to the intermediate type for safe access
    const rawContent = item.content as SupabasePlaylistItemContentQueryResult;

    // Explicitly construct ContentItem, mapping profiles.full_name to creator_name
    const content: ContentItem = {
      id: rawContent.id,
      title: rawContent.title,
      description: rawContent.description,
      image_url: rawContent.image_url,
      category: rawContent.category,
      link_slug: rawContent.link_slug,
      type: rawContent.type,
      video_url: rawContent.video_url,
      image_gallery_urls: rawContent.image_gallery_urls,
      music_embed_url: rawContent.music_embed_url,
      creator_id: rawContent.creator_id,
      creator_name: rawContent.profiles?.[0]?.full_name || null, // Access the first element of the profiles array
      link: '', // Will be set below
    };

    // Derive the 'link' property based on content type
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

    return {
      id: item.id,
      created_at: item.created_at,
      playlist_id: item.playlist_id,
      content_id: item.content_id,
      position: item.position,
      content: content,
    };
  });

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