import { supabase } from './supabaseClient';
import { ContentItem } from './content'; // Import ContentItem for featured content

// Function to fetch ticker messages from the 'ticker_messages' table
export const fetchTickerMessages = async () => {
  const { data, error } = await supabase
    .from('ticker_messages')
    .select('message')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching ticker messages:', error);
    throw error;
  }
  return data.map(item => item.message);
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

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching contact info:', error);
    throw error;
  }

  return data || null;
};

// Function to update user's preferred categories in user_metadata
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

// Interface for Innovator Profile (subset of full profile, focused on spotlight needs)
export interface InnovatorProfile {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  bio?: string | null;
  region?: string; // Added region to innovator profile
}

// Interface for Innovator Spotlight data
export interface InnovatorSpotlight {
  id: string;
  tagline: string;
  profile_id: string;
  profiles: InnovatorProfile; // Nested profile data
  spotlight_content_id?: string | null;
  content?: ContentItem | null; // Nested featured content data
}

// Function to fetch innovators for the spotlight section
export const fetchInnovatorsSpotlight = async (limit: number = 3): Promise<InnovatorSpotlight[]> => {
  const { data, error } = await supabase
    .from('innovators')
    .select(`
      id,
      tagline,
      profile_id,
      profiles (
        id,
        full_name,
        avatar_url,
        bio,
        region
      ),
      spotlight_content_id,
      content:spotlight_content_id (
        id, title, description, image_url, category, link_slug, type, creator_id, profiles(full_name), region, requires_membership
      )
    `)
    .limit(limit)
    .order('created_at', { ascending: false }); // Order by creation date for latest innovators

  if (error) {
    console.error('Error fetching innovators spotlight:', error);
    throw error;
  }

  // Map the data to ensure nested profiles and content are single objects
  const mappedData: InnovatorSpotlight[] = (data || []).map((item: any) => ({
    id: item.id,
    tagline: item.tagline,
    profile_id: item.profile_id,
    profiles: item.profiles && Array.isArray(item.profiles) && item.profiles.length > 0 ? item.profiles[0] : null,
    spotlight_content_id: item.spotlight_content_id,
    content: item.content ? {
      ...item.content,
      creator_name: (item.content as any).profiles?.full_name || null,
    } : null,
  }));

  return mappedData;
};