"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import PaginationControls from "@/components/PaginationControls";
import CategoryFilter from "@/components/CategoryFilter";
import RegionFilter from "@/components/RegionFilter"; // Import RegionFilter
import CreatorFilter from "@/components/CreatorFilter"; // Import CreatorFilter
import { fetchContent, fetchAllCreators } from "@/lib/supabase"; // Import fetchAllCreators
import { dummyShows } from "@/data/dummyContent";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event" | "sponsored" | "music_show";
  link: string;
  region?: string; // Added region
  creator_id?: string; // Added creator_id
}

interface Creator {
  id: string;
  full_name: string;
}

const ITEMS_PER_PAGE = 9;
const SHOW_CATEGORIES = ["Music", "Tech", "Fashion", "Sports", "Culture", "Nature"]; // Example categories
const AFRICAN_REGIONS = ["Southern Africa", "West Africa", "East Africa", "North Africa", "Central Africa"]; // Example regions

const ShowsListingPage = () => {
  const [shows, setShows] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCreator, setSelectedCreator] = useState("all"); // New state for creator filter
  const [creators, setCreators] = useState<Creator[]>([]); // State to store list of creators

  useEffect(() => {
    const getCreators = async () => {
      try {
        const fetchedCreators = await fetchAllCreators();
        setCreators(fetchedCreators);
      } catch (err) {
        console.error("Failed to fetch creators for filter:", err);
        // Optionally set an error or use a default empty list
      }
    };
    getCreators();
  }, []);

  useEffect(() => {
    const getShows = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const { data, count } = await fetchContent('show', ITEMS_PER_PAGE, offset, selectedCategory, selectedRegion, selectedCreator === "all" ? undefined : selectedCreator); // Pass selectedCreator

        if (data) {
          const mappedShows: ContentItem[] = data.map(item => ({
            ...item,
            link: `/shows/${item.link_slug}`,
          }));
          setShows(mappedShows);
          setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
        } else {
          // Fallback to dummy data if no data from Supabase
          const filteredDummy = dummyShows.filter(show =>
            (selectedCategory === "all" || show.category === selectedCategory) &&
            (selectedRegion === "all" || show.region === selectedRegion) &&
            (selectedCreator === "all" || show.creator_id === selectedCreator) // Filter dummy data by creator
          );
          const startIndex = offset;
          const endIndex = offset + ITEMS_PER_PAGE;
          const paginatedDummy = filteredDummy.slice(startIndex, endIndex).map(item => ({
            ...item,
            link: `/shows/${item.link_slug}`,
          }));
          setShows(paginatedDummy);
          setTotalPages(Math.ceil(filteredDummy.length / ITEMS_PER_PAGE));
        }
      } catch (err) {
        console.error("Failed to fetch shows:", err);
        setError("Failed to load shows. Please try again later.");
        // Fallback to dummy data on error
        const filteredDummy = dummyShows.filter(show =>
          (selectedCategory === "all" || show.category === selectedCategory) &&
          (selectedRegion === "all" || show.region === selectedRegion) &&
          (selectedCreator === "all" || show.creator_id === selectedCreator) // Filter dummy data by creator
        );
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const startIndex = offset;
        const endIndex = offset + ITEMS_PER_PAGE;
        const paginatedDummy = filteredDummy.slice(startIndex, endIndex).map(item => ({
          ...item,
          link: `/shows/${item.link_slug}`,
        }));
        setShows(paginatedDummy);
        setTotalPages(Math.ceil(filteredDummy.length / ITEMS_PER_PAGE));
      } finally {
        setLoading(false);
      }
    };

    getShows();
  }, [currentPage, selectedCategory, selectedRegion, selectedCreator]); // Re-fetch when creator changes

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setCurrentPage(1); // Reset to first page on region change
  };

  const handleCreatorChange = (creatorId: string) => {
    setSelectedCreator(creatorId);
    setCurrentPage(1); // Reset to first page on creator change
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">All Shows</h1>

        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categories={SHOW_CATEGORIES}
          />
          <RegionFilter
            selectedRegion={selectedRegion}
            onRegionChange={handleRegionChange}
            regions={AFRICAN_REGIONS}
          />
          <CreatorFilter
            selectedCreator={selectedCreator}
            onCreatorChange={handleCreatorChange}
            creators={creators}
          />
        </div>

        {error && (
          <div className="text-center text-destructive text-xl font-sans mb-8">{error}</div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        ) : shows.length === 0 ? (
          <div className="text-center text-muted-foreground text-xl font-sans">
            No shows available for this category, region, and creator.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shows.map((show) => (
              <ContentCard
                key={show.id}
                type="show"
                title={show.title}
                description={show.description}
                imageUrl={show.image_url}
                category={show.category}
                link={show.link}
                contentId={show.id}
                region={show.region} // Pass region to ContentCard
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ShowsListingPage;