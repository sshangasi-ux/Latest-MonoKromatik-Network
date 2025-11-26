"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { MembershipTier } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface MembershipTierCardProps {
  tier: MembershipTier;
  isCurrentTier?: boolean;
  onSubscribe: (tier: MembershipTier) => void;
  disabled?: boolean;
}

const MembershipTierCard: React.FC<MembershipTierCardProps> = ({
  tier,
  isCurrentTier = false,
  onSubscribe,
  disabled = false,
}) => {
  return (
    <Card className={cn(
      "flex flex-col bg-card border-border text-foreground transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20",
      isCurrentTier && "border-primary ring-2 ring-primary"
    )}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-heading font-bold uppercase tracking-tight text-primary">
          {tier.name}
        </CardTitle>
        {tier.description && (
          <CardDescription className="text-muted-foreground font-sans">
            {tier.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center p-6">
        <p className="text-5xl font-heading font-extrabold mb-4">
          {tier.currency} {tier.price.toFixed(2)}
          <span className="text-lg text-muted-foreground">/month</span>
        </p>
        <ul className="space-y-3 text-left w-full max-w-xs mx-auto">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-center text-foreground font-sans text-sm">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          onClick={() => onSubscribe(tier)}
          disabled={disabled || isCurrentTier}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20"
        >
          {isCurrentTier ? "Current Plan" : "Choose Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MembershipTierCard;