import { supabase } from './supabaseClient';

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