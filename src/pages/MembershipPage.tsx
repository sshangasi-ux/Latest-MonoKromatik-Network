"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Crown, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { fetchMembershipTiers, MembershipTier } from "@/lib/supabase";
import MembershipTierCard from "@/components/MembershipTierCard";
import { toast } from "sonner";

const MembershipPage = () => {
  const { isAuthenticated, user, userSubscription, refreshSubscription } = useAuth();
  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>([]);
  const [loadingTiers, setLoadingTiers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    const getMembershipTiers = async () => {
      setLoadingTiers(true);
      setError(null);
      try {
        const tiers = await fetchMembershipTiers();
        setMembershipTiers(tiers);
      } catch (err) {
        console.error("Failed to fetch membership tiers:", err);
        setError("Failed to load membership plans. Please try again later.");
      } finally {
        setLoadingTiers(false);
      }
    };

    getMembershipTiers();
  }, []);

  const handleSubscribe = async (tier: MembershipTier) => {
    if (!isAuthenticated || !user) {
      toast.info("Please log in to subscribe to a membership plan.");
      return;
    }

    setIsSubscribing(true);
    try {
      // --- CLIENT-SIDE INITIATION (Conceptual) ---
      // In a real application, this would involve:
      // 1. Calling a **server-side function** (e.g., Supabase Edge Function, Vercel Serverless Function)
      //    to create a Stripe Checkout Session.
      // 2. The server-side function would use your **Stripe Secret Key** to create the session.
      // 3. The server would return the `checkoutSession.url` or `checkoutSession.id`.
      // 4. You would then redirect the user to Stripe Checkout.

      toast.info(`Initiating subscription for ${tier.name}... (This is a conceptual step)`);
      console.log(`User ${user.id} attempting to subscribe to tier:`, tier);

      // Example of what a server-side call might look like:
      // const response = await fetch('/api/create-stripe-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ tierId: tier.id, userId: user.id, userEmail: user.email }),
      // });
      // const { url, error: checkoutError } = await response.json();
      // if (checkoutError) {
      //   throw new Error(checkoutError);
      // }
      // window.location.href = url; // Redirect to Stripe Checkout

      // For now, we'll simulate success and refresh subscription status
      // In a real flow, the subscription status would be updated via Stripe Webhooks
      // hitting your server-side function, which then updates your Supabase `user_subscriptions` table.
      setTimeout(async () => {
        toast.success(`Subscription initiated for ${tier.name}! Please complete payment.`);
        // Simulate a successful subscription for demo purposes
        // In a real app, this would be handled by webhooks
        await refreshSubscription(); // Manually refresh to show potential changes
        setIsSubscribing(false);
      }, 2000);

    } catch (err: any) {
      toast.error(`Failed to initiate subscription: ${err.message}`);
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-5xl font-heading font-extrabold mb-4 uppercase tracking-tight text-center">
          Choose Your <span className="text-primary">Membership</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 text-center max-w-3xl mx-auto font-sans">
          Unlock exclusive content, ad-free viewing, and special perks with our premium membership plans.
        </p>

        {error && (
          <div className="text-center text-destructive text-xl font-sans mb-8">{error}</div>
        )}

        {loadingTiers ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-xl text-muted-foreground font-sans">Loading membership plans...</p>
          </div>
        ) : membershipTiers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Info className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground font-sans">No membership plans available at the moment.</p>
            <p className="text-md text-muted-foreground mt-2 font-sans">Please check back later!</p>
          </div>
        ) : (
          <>
            {isAuthenticated && userSubscription && (
              <div className="bg-secondary p-6 rounded-lg border border-border mb-10 text-center max-w-2xl mx-auto">
                <h2 className="text-2xl font-heading font-bold mb-2 uppercase tracking-tight">
                  Your Current Plan: <span className="text-primary">{userSubscription.membership_tier?.name || "N/A"}</span>
                </h2>
                <p className="text-muted-foreground font-sans">
                  Status: <span className="capitalize">{userSubscription.status}</span>
                </p>
                {userSubscription.current_period_end && (
                  <p className="text-muted-foreground text-sm font-sans">
                    Renews on: {new Date(userSubscription.current_period_end).toLocaleDateString()}
                  </p>
                )}
                <Button
                  variant="outline"
                  className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase font-semibold text-sm px-6 py-3 rounded-lg"
                  onClick={() => toast.info("Managing subscriptions would typically happen on a dedicated billing portal or Stripe's customer portal.")}
                >
                  Manage Subscription
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {membershipTiers.map((tier) => (
                <MembershipTierCard
                  key={tier.id}
                  tier={tier}
                  isCurrentTier={userSubscription?.tier_id === tier.id && userSubscription?.status === 'active'}
                  onSubscribe={handleSubscribe}
                  disabled={isSubscribing}
                />
              ))}
            </div>
          </>
        )}

        <div className="mt-12 text-center text-muted-foreground text-sm font-sans">
          <p>
            Note: Full payment gateway integration (e.g., Stripe Checkout) requires server-side logic (Supabase Edge Functions or similar) to securely handle API keys and webhooks. The "Choose Plan" button currently simulates the initiation process.
          </p>
          <Link to="/" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm mt-4 block">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MembershipPage;