"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MasterclassCard from "@/components/MasterclassCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import PaginationControls from "@/components/PaginationControls";
import CategoryFilter from "@/components/CategoryFilter";
import { fetchMasterclasses, Masterclass } from "@/lib/masterclasses";
import { dummyMasterclasses } from "@/data/dummyContent";

const ITEMS_PER_PAGE = 9;
const MASTERCLASS_CATEGORIES = ["Music", "Tech", "Fashion", "Culture", "Business", "Art"]; // Example categories

const MasterclassesListingPage: React.FC = () => {
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const getMasterclasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const { data, count } = await fetchMasterclasses(ITEMS_PER_PAGE, offset, selectedCategory);

        if (data) {
          setMasterclasses(data);
          setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
        } else {
          const filteredDummy = selectedCategory === "all"
            ? dummyMasterclasses
            : dummyMasterclasses.filter(mc => mc.category === selectedCategory);
          const startIndex = offset;
          const endIndex = offset + ITEMS_PER_PAGE;
          const paginatedDummy = filteredDummy.slice(startIndex, endIndex);
          setMasterclasses(paginatedDummy);
          setTotalPages(Math.ceil(filteredDummy.length / ITEMS_PER_PAGE));
        }
      } catch (err) {
        console.error("Failed to fetch masterclasses:", err);
        setError("Failed to load masterclasses. Please try again later.");
        const filteredDummy = selectedCategory === "all"
          ? dummyMasterclasses
          : dummyMasterclasses.filter(mc => mc.category === selectedCategory);
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const startIndex = offset;
        const endIndex = offset + ITEMS_PER_PAGE;
        const paginatedDummy = filteredDummy.slice(startIndex, endIndex);
        setMasterclasses(paginatedDummy);
        setTotalPages(Math.ceil(filteredDummy.length / ITEMS_PER_PAGE));
      } finally {
        setLoading(false);
      }
    };

    getMasterclasses();
  }, [currentPage, selectedCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">All Masterclasses</h1>

        <div className="flex justify-center mb-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categories={MASTERCLASS_CATEGORIES}
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
        ) : masterclasses.length === 0 ? (
          <div className="text-center text-muted-foreground text-xl font-sans">
            No masterclasses available for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {masterclasses.map((masterclass) => (
              <MasterclassCard
                key={masterclass.id}
                masterclass={masterclass}
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

export default MasterclassesListingPage;