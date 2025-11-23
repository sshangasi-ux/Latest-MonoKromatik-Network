"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  categories,
}) => {
  return (
    <div className="flex items-center space-x-2 mb-8">
      <Label htmlFor="category-filter" className="text-foreground uppercase font-semibold text-sm">
        Filter by Category:
      </Label>
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger id="category-filter" className="w-[180px] bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent uppercase text-sm">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border text-foreground">
          <SelectItem value="all" className="uppercase text-sm">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category} className="uppercase text-sm">
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryFilter;