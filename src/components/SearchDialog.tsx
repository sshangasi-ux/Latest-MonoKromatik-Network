"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { fetchContent } from "@/lib/supabase";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event";
}

const SearchDialog = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [filteredResults, setFilteredResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch all content once when the component mounts
  useEffect(() => {
    const getAllContent = async () => {
      try {
        setLoading(true);
        const { data } = await fetchContent();
        setAllContent(data as ContentItem[]);
      } catch (err) {
        console.error("Failed to fetch all content for search:", err);
        setError("Failed to load search data.");
      } finally {
        setLoading(false);
      }
    };
    getAllContent();
  }, []);

  // Filter results based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredResults([]);
      return;
    }

    const lowerCaseQuery = searchTerm.toLowerCase();
    const results = allContent.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        item.description.toLowerCase().includes(lowerCaseQuery) ||
        item.category.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredResults(results.slice(0, 5)); // Limit to top 5 suggestions
  }, [searchTerm, allContent]);

  // Handle keyboard shortcuts for opening the dialog
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback(
    (item: ContentItem) => {
      let linkPrefix = '';
      switch (item.type) {
        case 'show': linkPrefix = '/shows'; break;
        case 'video': linkPrefix = '/watch'; break;
        case 'article': linkPrefix = '/news'; break;
        case 'event': linkPrefix = '/events'; break;
        default: linkPrefix = '';
      }
      navigate(`${linkPrefix}/${item.link_slug}`);
      setOpen(false);
      setSearchTerm(""); // Clear search term after navigation
    },
    [navigate]
  );

  const handleFullSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setOpen(false);
      setSearchTerm(""); // Clear search term after navigation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
          <Search className="h-5 w-5" />
          <span className="sr-only">Open Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 max-w-xl bg-neutral-900 text-white border-neutral-800">
        <Command className="rounded-lg border-none shadow-md bg-neutral-900 text-white">
          <CommandInput
            placeholder="Search for shows, articles, videos..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="h-12 bg-neutral-800 border-b border-neutral-700 placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0"
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            {loading && <CommandEmpty>Loading content...</CommandEmpty>}
            {error && <CommandEmpty className="text-red-500">{error}</CommandEmpty>}
            {!loading && !error && searchTerm.trim() === "" && (
              <CommandEmpty>Start typing to search.</CommandEmpty>
            )}
            {!loading && !error && searchTerm.trim() !== "" && filteredResults.length === 0 && (
              <CommandEmpty>No results found for "{searchTerm}".</CommandEmpty>
            )}
            <CommandGroup heading="Suggestions">
              {filteredResults.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.title} ${item.description} ${item.category}`}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-neutral-800"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-8 w-8 object-cover rounded-sm"
                  />
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            {!loading && !error && searchTerm.trim() !== "" && (
              <CommandGroup>
                <CommandItem onSelect={handleFullSearch} className="cursor-pointer hover:bg-neutral-800 text-red-500 justify-center">
                  View all results for "{searchTerm}"
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;