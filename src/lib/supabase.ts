import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided as environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to fetch content from the 'content' table with optional type, limit, and offset for pagination
export const fetchContent = async (type?: string, limit?: number, offset?: number) => {
  let query = supabase.from('content').select('*', { count: 'exact' }); // Request exact count for pagination

  if (type) {
    query = query.eq('type', type);
  }

  if (limit !== undefined && offset !== undefined) {
    query = query.range(offset, offset + limit - 1);
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

// Function to fetch hero content from the 'hero_content' table
export const fetchHeroContent = async () => {
  const { data, error } = await supabase
    .from('hero_content')
    .select('*')
    .single(); // Assuming there's only one main hero content item

  if (error) {
    console.error('Error fetching hero content:', error);
    throw error;
  }
  return data;
};