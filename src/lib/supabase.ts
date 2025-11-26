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

// Re-export all from likes module
export * from './likes';

// Re-export all from reviews module
export * from './reviews';

// New: Interfaces for Membership
export interface MembershipTier {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  features: string[]; // JSONB array of strings
  stripe_price_id: string | null;
}

export interface UserSubscription {
  id: string;
  created_at: string;
  user_id: string;
  tier_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'pending' | 'incomplete' | 'unpaid' | 'paused' | 'ended';
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  ended_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
  membership_tier?: MembershipTier | null; // Nested tier details
}

// New: Function to fetch all membership tiers
export const fetchMembershipTiers = async (): Promise<MembershipTier[]> => {
  const { data, error } = await supabase
    .from('membership_tiers')
    .select('*')
    .order('price', { ascending: true }); // Order by price, cheapest first

  if (error) {
    console.error('Error fetching membership tiers:', error);
    throw error;
  }
  return data || [];
};

// New: Function to fetch a user's active subscription
export const fetchUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select(`
      *,
      membership_tier:tier_id (
        id, name, description, price, currency, features, stripe_price_id
      )
    `)
    .eq('user_id', userId)
    .in('status', ['active', 'trialing', 'past_due']) // Consider these as 'active' for display purposes
    .order('created_at', { ascending: false }) // Get the most recent active-like subscription
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error('Error fetching user subscription:', error);
    throw error;
  }

  if (!data) return null;

  // Map the nested membership_tier from an array (if Supabase returns it that way)
  const mappedData: UserSubscription = {
    ...data,
    membership_tier: (data as any).membership_tier && Array.isArray((data as any).membership_tier) && (data as any).membership_tier.length > 0
      ? (data as any).membership_tier[0]
      : (data as any).membership_tier || null,
  };

  return mappedData;
};


// Export the supabase client directly for convenience if needed
export { supabase };