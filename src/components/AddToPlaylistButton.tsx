"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, ListPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserPlaylists, addContentToPlaylist, isContentInPlaylist, Playlist } from "@/lib/supabase";
import { toast } from "sonner";
import CreatePlaylistDialog from "./CreatePlaylistDialog";

interface AddToPlaylistButtonProps {
  contentId: string;
  contentTitle: string;
  className?: string;
}

const AddToPlaylistButton: React.FC<AddToPlaylistButtonProps> = ({ contentId, contentTitle, className }) => {
  const { user, isAuthenticated } = useAuth();
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false);

  const loadUserPlaylists = async () => {
    if (!isAuthenticated || !user) {
      setUserPlaylists([]);
      setLoadingPlaylists(false);
      return;
    }
    setLoadingPlaylists(true);
    try {
      const playlists = await fetchUserPlaylists(user.id);
      setUserPlaylists(playlists);
    } catch (err) {
      console.error("Failed to fetch user playlists:", err);
      toast.error("Failed to load your playlists.");
    } finally {
      setLoadingPlaylists(false);
    }
  };

  useEffect(() => {
    loadUserPlaylists();
  }, [isAuthenticated, user]);

  const handleAddContent = async (playlistId: string, playlistName: string) => {
    if (!isAuthenticated || !user) {
      toast.info("Please log in to add content to a playlist.");
      return;
    }

    setIsAddingToPlaylist(true);
    try {
      const alreadyInPlaylist = await isContentInPlaylist(playlistId, contentId);
      if (alreadyInPlaylist) {
        toast.info(`"${contentTitle}" is already in "${playlistName}".`);
        return;
      }

      await addContentToPlaylist(playlistId, contentId);
      toast.success(`"${contentTitle}" added to "${playlistName}"!`);
    } catch (err) {
      console.error("Failed to add content to playlist:", err);
      toast.error(`Failed to add "${contentTitle}" to playlist.`);
    } finally {
      setIsAddingToPlaylist(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={loadingPlaylists || isAddingToPlaylist || !isAuthenticated}
          className={`border-border text-foreground hover:bg-secondary hover:text-primary ${className}`}
          aria-label="Add to playlist"
        >
          <ListPlus className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-card border-border text-foreground">
        <DropdownMenuLabel className="font-heading uppercase tracking-tight">Add to Playlist</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        {loadingPlaylists ? (
          <DropdownMenuItem disabled>Loading playlists...</DropdownMenuItem>
        ) : userPlaylists.length === 0 ? (
          <DropdownMenuItem disabled>No playlists found.</DropdownMenuItem>
        ) : (
          userPlaylists.map((playlist) => (
            <DropdownMenuItem
              key={playlist.id}
              onClick={() => handleAddContent(playlist.id, playlist.name)}
              disabled={isAddingToPlaylist}
              className="uppercase text-sm"
            >
              {playlist.name}
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator className="bg-border" />
        <CreatePlaylistDialog
          onPlaylistCreated={loadUserPlaylists} // Reload playlists after a new one is created
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center text-primary hover:text-primary/90 uppercase text-sm">
              <Plus className="mr-2 h-4 w-4" /> Create New Playlist
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddToPlaylistButton;