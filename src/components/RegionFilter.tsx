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

interface RegionFilterProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  regions: string[];
}

const RegionFilter: React.FC<RegionFilterProps> = ({
  selectedRegion,
  onRegionChange,
  regions,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="region-filter" className="text-foreground uppercase font-semibold text-sm">
        Filter by Region:
      </Label>
      <Select value={selectedRegion} onValueChange={onRegionChange}>
        <SelectTrigger id="region-filter" className="w-[180px] bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent uppercase text-sm">
          <SelectValue placeholder="All Regions" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border text-foreground">
          <SelectItem value="all" className="uppercase text-sm">All Regions</SelectItem>
          {regions.map((region) => (
            <SelectItem key={region} value={region} className="uppercase text-sm">
              {region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RegionFilter;