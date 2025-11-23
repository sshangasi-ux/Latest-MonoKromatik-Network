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
    .select('*')
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
    .select('*')
    .eq('link_slug', slug)
    .eq('type', type)
    .single(); // Use .single() to expect one row

  if (error) {
    console.error(`Error fetching content with slug ${slug} and type ${type}:`, error);
    throw error;
  }
  return data;
};