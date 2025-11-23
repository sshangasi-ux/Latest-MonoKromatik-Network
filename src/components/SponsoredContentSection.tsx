"use client";

import React, { useEffect, useState } from "react";
import ContentCard from "./ContentCard";
import ContentCardSkeleton from "./ContentCardSkeleton";
import { dummySponsoredContent } from "@/data/dummyContent";
// In a real application, you would fetch sponsored content from Supabase
// import { fetchSponsoredContent } from "@/lib/supabase";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event" | "sponsored" | "music_show"; // Added 'music_show'
  link: string;
}

const SponsoredContentSection = () => {
  const [sponsoredItems, setSponsoredItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSponsoredContent = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call, e.g.:
        // const { data } = await fetchSponsoredContent(3);
        // setSponsoredItems(data as ContentItem[]);

        // For now, use dummy data
        setSponsoredItems(dummySponsoredContent.map(item => ({
          ...item,
          link: `/sponsored/${item.link_slug}`, // Ensure correct link for sponsored content
        })));
      } catch (err) {
        console.error("Failed to fetch sponsored content:", err);
        setError("Failed to load sponsored content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getSponsoredContent();
  }, []);

  if (error) {
    return (
      <section className="py-12 bg-background text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 uppercase tracking-tight">Sponsored Content</h2>
          <p className="text-destructive font-sans">{error}</p>
        </div>
      </section>
    );
  }

  if (sponsoredItems.length === 0 && !loading) {
    return null; // Don't render if no sponsored items and not loading
  }

  return (
    <section className="py-12 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">
          <span className="text-primary">Sponsored</span> Content
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsoredItems.map((item) => (
              <ContentCard
                key={item.id}
                type="sponsored" // Explicitly set type to 'sponsored'
                title={item.title}
                description={item.description}
                imageUrl={item.image_url}
                category="Sponsored" // Override category for display
                link={item.link}
                contentId={item.id} // Added contentId prop
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SponsoredContentSection;