-- Create membership_tiers table
CREATE TABLE public.membership_tiers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL UNIQUE,
    description text,
    price numeric(10, 2) NOT NULL,
    currency text DEFAULT 'ZAR' NOT NULL, -- Assuming ZAR for South African context
    features jsonb DEFAULT '[]'::jsonb NOT NULL, -- e.g., ["Ad-free viewing", "Exclusive content"]
    stripe_price_id text UNIQUE -- Stores the Stripe Price ID for this tier
);

-- Add RLS for membership_tiers (read-only for all, insert/update/delete for admin)
ALTER TABLE public.membership_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to membership tiers" ON public.membership_tiers FOR SELECT USING (true);
-- You would add policies for admin roles to manage tiers if you build an admin panel.

-- Create user_subscriptions table
CREATE TABLE public.user_subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    tier_id uuid REFERENCES public.membership_tiers(id) ON DELETE RESTRICT NOT NULL,
    stripe_customer_id text, -- Stripe Customer ID
    stripe_subscription_id text UNIQUE, -- Stripe Subscription ID
    status text DEFAULT 'pending' NOT NULL, -- e.g., 'active', 'cancelled', 'past_due', 'trialing'
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    cancel_at_period_end boolean DEFAULT false,
    ended_at timestamp with time zone,
    trial_start timestamp with time zone,
    trial_end timestamp with time zone,
    CONSTRAINT unique_user_active_subscription UNIQUE (user_id, status) WHERE (status = 'active')
);

-- Add RLS for user_subscriptions (users can only see/manage their own subscriptions)
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own subscriptions" ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscriptions" ON public.user_subscriptions FOR UPDATE USING (auth.uid() = user_id);
-- Admin policies would be needed for full management.