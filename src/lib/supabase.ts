import { supabase } from './supabaseClient';

// Re-export all from content module
export * from './content';

// Re-export all from userProgress module
export * from './userProgress';

// Re-export all from watchlist module
export * from './watchlist';

// Re-export all from comments module
export * from './comments';

// Re-export all from creators module
export * from './creators';

// Re-export all from playlists module
export * from './playlists';

// Re-export all from masterclasses module
export * from './masterclasses';

// Re-export all from misc module
export * from './misc';

// Export the supabase client directly for convenience if needed
export { supabase };