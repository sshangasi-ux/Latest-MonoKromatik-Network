// This is a conceptual Supabase Edge Function (or similar serverless function).
// It is NOT part of your client-side React application.
// You would deploy this separately to handle secure Stripe webhook events.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.8.0';
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  });

  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret!);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Initialize Supabase client with service role key for admin access
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const userId = checkoutSession.metadata?.userId;
        const tierId = checkoutSession.metadata?.tierId;
        const stripeSubscriptionId = checkoutSession.subscription as string;
        const stripeCustomerId = checkoutSession.customer as string;

        if (userId && tierId && stripeSubscriptionId && stripeCustomerId) {
          // Fetch subscription details from Stripe to get current_period_start/end
          const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

          // Insert or update user_subscriptions table
          const { error: upsertError } = await supabaseAdmin
            .from('user_subscriptions')
            .upsert(
              {
                user_id: userId,
                tier_id: tierId,
                stripe_customer_id: stripeCustomerId,
                stripe_subscription_id: stripeSubscriptionId,
                status: 'active',
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end,
                trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
                trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
              },
              { onConflict: 'stripe_subscription_id' } // Update if subscription already exists
            );

          if (upsertError) {
            console.error('Error upserting user subscription:', upsertError);
            throw upsertError;
          }
          console.log(`User ${userId} subscribed to tier ${tierId}.`);
        }
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        const newStatus = subscription.status;
        const cancelAtPeriodEnd = subscription.cancel_at_period_end;
        const endedAt = subscription.ended_at ? new Date(subscription.ended_at * 1000).toISOString() : null;

        const { error: updateError } = await supabaseAdmin
          .from('user_subscriptions')
          .update({
            status: newStatus,
            cancel_at_period_end: cancelAtPeriodEnd,
            ended_at: endedAt,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (updateError) {
          console.error('Error updating user subscription status:', updateError);
          throw updateError;
        }
        console.log(`Subscription ${subscription.id} updated to status: ${newStatus}.`);
        break;

      default:
        console.warn(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing Stripe webhook event:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});