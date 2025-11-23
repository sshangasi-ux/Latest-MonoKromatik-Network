"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User as UserIcon, ArrowRight } from "lucide-react";
import { InnovatorSpotlight } from "@/lib/misc"; // Import the interface

interface InnovatorCardProps {
  innovator: InnovatorSpotlight;
}

const InnovatorCard: React.FC<InnovatorCardProps> = ({ innovator }) => {
  return (
    <Card className="h-full flex flex-col bg-card text-foreground border-border overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20">
      <CardHeader className="flex flex-col items-center text-center p-6 pb-4">
        <Link to={`/creators/${innovator.profile_id}`} className="block">
          <Avatar className="h-24 w-24 mb-4 border-4 border-primary">
            <AvatarImage src={innovator.profiles?.avatar_url || undefined} alt={innovator.profiles?.full_name || "Innovator"} />
            <AvatarFallback className="bg-muted text-muted-foreground text-4xl">
              {innovator.profiles?.full_name ? innovator.profiles.full_name.charAt(0).toUpperCase() : <UserIcon className="h-12 w-12" />}
            </AvatarFallback>
          </Avatar>
        </Link>
        <CardTitle className="text-2xl font-heading font-bold mb-1 uppercase tracking-tight">
          <Link to={`/creators/${innovator.profile_id}`} className="hover:text-primary transition-colors">
            {innovator.profiles?.full_name || "Unknown Innovator"}
          </Link>
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm font-sans line-clamp-2">
          {innovator.tagline}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
        {innovator.content ? (
          <div className="bg-secondary rounded-lg p-4 border border-border">
            <h3 className="text-lg font-heading font-semibold mb-2 uppercase tracking-tight">Featured Content:</h3>
            <Link to={innovator.content.link} className="block group">
              <img
                src={innovator.content.image_url}
                alt={innovator.content.title}
                className="w-full h-32 object-cover rounded-md mb-2 transition-transform duration-300 group-hover:scale-105"
              />
              <p className="text-primary font-semibold text-sm line-clamp-2 group-hover:underline uppercase font-sans">
                {innovator.content.title}
              </p>
            </Link>
          </div>
        ) : (
          <p className="text-muted-foreground text-center text-sm font-sans">No featured content.</p>
        )}
      </CardContent>
      <div className="p-6 pt-0">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
          <Link to={`/creators/${innovator.profile_id}`} className="flex items-center justify-center">
            View Profile <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default InnovatorCard;