"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import MasterclassCard from "./MasterclassCard";
import ContentCardSkeleton from "./ContentCardSkeleton"; // Reusing skeleton for loading state
import { fetchMasterclasses, Masterclass } from "@/lib/masterclasses"; // Import the fetch function and interface
import { dummyMasterclasses } from "@/data/dummyContent"; // Import dummy data

const MasterclassesSection: React.FC = () => {
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMasterclasses = async () => {
      try {
        setLoading(true);
        const { data } = await fetchMasterclasses(6); // Fetch up to 6 masterclasses
        
        if (data && data.length > 0) {
          setMasterclasses(data);
        } else {
          // Fallback to dummy data if no data from Supabase
          setMasterclasses(dummyMasterclasses);
        }
      } catch (err) {
        console.error("Failed to fetch masterclasses:", err);
        setError("Failed to load masterclasses. Please try again later.");
        // Fallback to dummy data on error
        setMasterclasses(dummyMasterclasses);
      } finally {
        setLoading(false);
      }
    };

    getMasterclasses();
  }, []);

  if (error) {
    return (
      <section className="py-12 bg-background text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 uppercase tracking-tight">Masterclasses</h2>
          <p className="text-destructive font-sans">{error}</p>
        </div>
      </section>
    );
  }

  if (masterclasses.length === 0 && !loading) {
    return null; // Don't render if no masterclasses and not loading
  }

  return (
    <section className="py-12 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">
          Masterclasses & <span className="text-primary">Workshops</span>
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
              {masterclasses.map((masterclass) => (
                <CarouselItem key={masterclass.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <MasterclassCard masterclass={masterclass} />
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

export default MasterclassesSection;