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

interface Creator {
  id: string;
  full_name: string;
}

interface CreatorFilterProps {
  selectedCreator: string;
  onCreatorChange: (creatorId: string) => void;
  creators: Creator[];
}

const CreatorFilter: React.FC<CreatorFilterProps> = ({
  selectedCreator,
  onCreatorChange,
  creators,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="creator-filter" className="text-foreground uppercase font-semibold text-sm">
        Filter by Creator:
      </Label>
      <Select value={selectedCreator} onValueChange={onCreatorChange}>
        <SelectTrigger id="creator-filter" className="w-[180px] bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent uppercase text-sm">
          <SelectValue placeholder="All Creators" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border text-foreground">
          <SelectItem value="all" className="uppercase text-sm">All Creators</SelectItem>
          {creators.map((creator) => (
            <SelectItem key={creator.id} value={creator.id} className="uppercase text-sm">
              {creator.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CreatorFilter;