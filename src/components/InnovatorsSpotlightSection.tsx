"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import InnovatorCard from "./InnovatorCard";
import ContentCardSkeleton from "./ContentCardSkeleton"; // Reusing skeleton for loading state
import { fetchInnovatorsSpotlight, InnovatorSpotlight } from "@/lib/misc"; // Import the fetch function and interface
import { dummyInnovators } from "@/data/dummyContent"; // Import dummy data

const InnovatorsSpotlightSection: React.FC = () => {
  const [innovators, setInnovators] = useState<InnovatorSpotlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getInnovators = async () => {
      try {
        setLoading(true);
        const fetchedInnovators = await fetchInnovatorsSpotlight(6); // Fetch up to 6 innovators
        
        if (fetchedInnovators && fetchedInnovators.length > 0) {
          setInnovators(fetchedInnovators);
        } else {
          // Fallback to dummy data if no data from Supabase
          setInnovators(dummyInnovators);
        }
      } catch (err) {
        console.error("Failed to fetch innovators spotlight:", err);
        setError("Failed to load innovators spotlight. Please try again later.");
        // Fallback to dummy data on error
        setInnovators(dummyInnovators);
      } finally {
        setLoading(false);
      }
    };

    getInnovators();
  }, []);

  if (error) {
    return (
      <section className="py-12 bg-background text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 uppercase tracking-tight">Innovators Spotlight</h2>
          <p className="text-destructive font-sans">{error}</p>
        </div>
      </section>
    );
  }

  if (innovators.length === 0 && !loading) {
    return null; // Don't render if no innovators and not loading
  }

  return (
    <section className="py-12 bg-secondary text-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">
          Innovators <span className="text-primary">Spotlight</span>
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {innovators.map((innovator) => (
                <CarouselItem key={innovator.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <InnovatorCard innovator={innovator} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary" />
            <CarouselNext className="right-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary" />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default InnovatorsSpotlightSection;