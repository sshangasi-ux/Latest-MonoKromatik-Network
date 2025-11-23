"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import { searchContent } from "@/lib/supabase";
import { allDummyContent } from "@/data/dummyContent";
import RegionFilter from "@/components/RegionFilter"; // Import RegionFilter
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

const AFRICAN_REGIONS = ["Southern Africa", "West Africa", "East Africa", "North Africa", "Central Africa"]; // Define regions
const CONTENT_TYPES = [
  { value: "all", label: "All Types" },
  { value: "show", label: "Shows" },
  { value: "video", label: "Videos" },
  { value: "article", label: "Articles" },
  { value: "event", label: "Events" },
  { value: "music_show", label: "Music Shows" },
  { value: "sponsored", label: "Sponsored" },
];

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("all"); // State for region filter
  const [selectedType, setSelectedType] = useState("all"); // New state for content type filter

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Pass selectedRegion and selectedType to searchContent
        const { data, error } = await searchContent(query, 20, selectedRegion, selectedType === "all" ? undefined : selectedType);
        if (error) {
          throw error;
        }
        const mappedResults: ContentItem[] = (data as ContentItem[]).map(item => {
          let linkPrefix = '';
          switch (item.type) {
            case 'show': linkPrefix = '/shows'; break;
            case 'video': linkPrefix = '/watch'; break;
            case 'article': linkPrefix = '/news'; break;
            case 'event': linkPrefix = '/events'; break;
            case 'sponsored': linkPrefix = '/sponsored'; break;
            case 'music_show': linkPrefix = '/music/shows'; break; // Added 'music_show'
            default: linkPrefix = '';
          }
          return { ...item, link: `${linkPrefix}/${item.link_slug}` };
        });
        setResults(mappedResults);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
        setError("Failed to load search results. Please try again later.");
        const dummyFiltered = allDummyContent.filter(item =>
          (item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())) &&
          (selectedRegion === "all" || item.region === selectedRegion) && // Filter dummy content by region
          (selectedType === "all" || item.type === selectedType) // Filter dummy content by type
        ).slice(0, 20);
        setResults(dummyFiltered);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, selectedRegion, selectedType]); // Re-fetch when query, selectedRegion, or selectedType changes

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center uppercase text-foreground tracking-tight">
          Search Results for "{query}"
        </h1>

        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
          <RegionFilter
            selectedRegion={selectedRegion}
            onRegionChange={handleRegionChange}
            regions={AFRICAN_REGIONS}
          />
          <div className="flex items-center space-x-2">
            <Label htmlFor="type-filter" className="text-foreground uppercase font-semibold text-sm">
              Filter by Type:
            </Label>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger id="type-filter" className="w-[180px] bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent uppercase text-sm">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                {CONTENT_TYPES.map((typeOption) => (
                  <SelectItem key={typeOption.value} value={typeOption.value} className="uppercase text-sm">
                    {typeOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-destructive text-xl font-sans">{error}</div>
        ) : results.length === 0 ? (
          <div className="text-center text-muted-foreground text-xl font-sans">
            No results found for "{query}" in {selectedRegion === "all" ? "all regions" : selectedRegion} and {selectedType === "all" ? "all types" : selectedType}. Try a different search term, region, or type.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => (
              <ContentCard
                key={item.id}
                contentId={item.id} // Added contentId prop
                type={item.type}
                title={item.title}
                description={item.description}
                imageUrl={item.image_url}
                category={item.category}
                link={item.link}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;