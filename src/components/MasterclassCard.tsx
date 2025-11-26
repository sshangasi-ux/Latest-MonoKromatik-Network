"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, User, Clock, DollarSign } from "lucide-react";
import { Masterclass } from "@/lib/masterclasses"; // Import the Masterclass interface
import { cn } from "@/lib/utils";

interface MasterclassCardProps {
  masterclass: Masterclass;
  className?: string;
}

const MasterclassCard: React.FC<MasterclassCardProps> = ({ masterclass, className }) => {
  return (
    <Link to={masterclass.link} className={cn("block h-full", className)}>
      <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.02] bg-card text-card-foreground">
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={masterclass.image_url}
            alt={masterclass.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"; // Fallback image
            }}
          />
          <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full capitalize">
            {masterclass.category}
          </span>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">{masterclass.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground capitalize">Masterclass</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow text-sm text-foreground line-clamp-3">
          {masterclass.description}
        </CardContent>
        <CardFooter className="pt-2 flex flex-col items-start space-y-2">
          {masterclass.instructor && (
            <Button asChild variant="link" size="sm" className="w-full justify-start p-0 h-auto text-muted-foreground hover:text-primary">
              <Link to={`/creators/${masterclass.instructor.id}`} className="flex items-center text-xs uppercase font-semibold">
                <User className="h-3 w-3 mr-1" />
                By {masterclass.instructor.full_name}
              </Link>
            </Button>
          )}
          <div className="flex items-center justify-between w-full text-muted-foreground text-xs font-sans">
            {masterclass.duration_minutes && (
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" /> {masterclass.duration_minutes} min
              </span>
            )}
            {masterclass.price !== undefined && masterclass.price !== null && (
              <span className="flex items-center">
                <DollarSign className="h-3 w-3 mr-1" /> {masterclass.price === 0 ? "Free" : masterclass.price.toFixed(2)}
              </span>
            )}
          </div>
          <Button variant="secondary" size="sm" className="w-full mt-2">
            <BookOpen className="h-4 w-4 mr-1" />
            View Masterclass
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default MasterclassCard;