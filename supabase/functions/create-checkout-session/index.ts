// This is a conceptual Supabase Edge Function (or similar serverless function).
// It is NOT part of your client-side React application.
// You would deploy this separately to handle secure Stripe API calls.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.8.0';
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { tierId, userId, userEmail } = await req.json();

    // Initialize Supabase client for database interaction
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch the membership tier details from your Supabase database
    const { data: tier, error: tierError } = await supabaseAdmin
      .from('membership_tiers')
      .select('name, price, currency, stripe_price_id')
      .eq('id', tierId)
      .single();

    if (tierError || !tier || !tier.stripe_price_id) {
      console.error('Error fetching tier or Stripe Price ID:', tierError);
      return new Response(JSON.stringify({ error: 'Membership tier not found or misconfigured.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2023-10-16', // Use a recent API version
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Create a Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: tier.stripe_price_id, // Use the Stripe Price ID
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: userEmail, // Pre-fill customer email
      success_url: `${Deno.env.get('FRONTEND_URL')}/membership?success=true`,
      cancel_url: `${Deno.env.get('FRONTEND_URL')}/membership?canceled=true`,
      metadata: {
        userId: userId,
        tierId: tierId,
      },
    });

    return new Response(JSON.stringify({ url: checkoutSession.url }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Stripe Checkout Session creation failed:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});