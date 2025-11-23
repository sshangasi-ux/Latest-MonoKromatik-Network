"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { fetchUserPlaylists, fetchPlaylistItems, removeContentFromPlaylist, Playlist, PlaylistItem } from "@/lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListMusic, Plus, Trash2, Frown } from "lucide-react";
import CreatePlaylistDialog from "@/components/CreatePlaylistDialog";
import ContentCard from "@/components/ContentCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import { toast } from "sonner";

const UserPlaylistsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [errorPlaylists, setErrorPlaylists] = useState<string | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [selectedPlaylistItems, setSelectedPlaylistItems] = useState<PlaylistItem[]>([]);
  const [loadingPlaylistItems, setLoadingPlaylistItems] = useState(false);
  const [errorPlaylistItems, setErrorPlaylistItems] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const loadPlaylists = async () => {
    if (!user) return;
    setLoadingPlaylists(true);
    setErrorPlaylists(null);
    try {
      const fetchedPlaylists = await fetchUserPlaylists(user.id);
      setPlaylists(fetchedPlaylists);
      if (fetchedPlaylists.length > 0 && !selectedPlaylistId) {
        setSelectedPlaylistId(fetchedPlaylists[0].id); // Select the first playlist by default
      } else if (fetchedPlaylists.length === 0) {
        setSelectedPlaylistId(null);
      }
    } catch (err) {
      console.error("Failed to fetch user playlists:", err);
      setErrorPlaylists("Failed to load your playlists. Please try again later.");
    } finally {
      setLoadingPlaylists(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadPlaylists();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const loadPlaylistContent = async () => {
      if (!selectedPlaylistId) {
        setSelectedPlaylistItems([]);
        return;
      }
      setLoadingPlaylistItems(true);
      setErrorPlaylistItems(null);
      try {
        const items = await fetchPlaylistItems(selectedPlaylistId);
        setSelectedPlaylistItems(items);
      } catch (err) {
        console.error("Failed to fetch playlist items:", err);
        setErrorPlaylistItems("Failed to load playlist content. Please try again later.");
      } finally {
        setLoadingPlaylistItems(false);
      }
    };

    loadPlaylistContent();
  }, [selectedPlaylistId]);

  const handleRemoveFromPlaylist = async (playlistItemId: string, contentTitle: string) => {
    if (!confirm(`Are you sure you want to remove "${contentTitle}" from this playlist?`)) {
      return;
    }
    try {
      await removeContentFromPlaylist(playlistItemId);
      toast.success(`"${contentTitle}" removed from playlist.`);
      setSelectedPlaylistItems(prev => prev.filter(item => item.id !== playlistItemId));
    } catch (err) {
      console.error("Failed to remove content from playlist:", err);
      toast.error(`Failed to remove "${contentTitle}" from playlist.`);
    }
  };

  if (!isAuthenticated) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">
          My Playlists
        </h1>

        <div className="flex justify-center mb-8">
          <CreatePlaylistDialog onPlaylistCreated={loadPlaylists} />
        </div>

        {loadingPlaylists ? (
          <p className="text-muted-foreground text-center font-sans">Loading your playlists...</p>
        ) : errorPlaylists ? (
          <p className="text-destructive text-center font-sans">{errorPlaylists}</p>
        ) : playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ListMusic className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground font-sans">You haven't created any playlists yet.</p>
            <p className="text-md text-muted-foreground mt-2 font-sans">Click "Create New Playlist" to get started!</p>
          </div>
        ) : (
          <Tabs value={selectedPlaylistId || undefined} onValueChange={setSelectedPlaylistId} className="w-full max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-5 bg-secondary border-border overflow-x-auto">
              {playlists.map((playlist) => (
                <TabsTrigger key={playlist.id} value={playlist.id} className="uppercase font-semibold text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap">
                  {playlist.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {playlists.map((playlist) => (
              <TabsContent key={playlist.id} value={playlist.id} className="mt-6">
                <Card className="bg-card border-border text-foreground">
                  <CardHeader>
                    <CardTitle className="font-heading uppercase tracking-tight">{playlist.name}</CardTitle>
                    {playlist.description && (
                      <CardDescription className="font-sans text-muted-foreground">{playlist.description}</CardDescription>
                    )}
                    {playlist.cover_image_url && (
                      <img src={playlist.cover_image_url} alt={`${playlist.name} cover`} className="w-full h-48 object-cover rounded-md mt-4" />
                    )}
                    <p className="text-sm text-muted-foreground mt-2 font-sans">
                      {playlist.is_public ? "Public Playlist" : "Private Playlist"}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-heading font-bold mb-4 uppercase tracking-tight">Content in this Playlist</h3>
                    {loadingPlaylistItems ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <ContentCardSkeleton key={index} />
                        ))}
                      </div>
                    ) : errorPlaylistItems ? (
                      <p className="text-destructive text-center font-sans">{errorPlaylistItems}</p>
                    ) : selectedPlaylistItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Frown className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground font-sans">This playlist is empty. Add some content!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedPlaylistItems.map((item) => item.content && (
                          <div key={item.id} className="relative group">
                            <ContentCard
                              contentId={item.content.id}
                              type={item.content.type}
                              title={item.content.title}
                              description={item.content.description}
                              imageUrl={item.content.image_url}
                              category={item.content.category}
                              link={`/${item.content.type === 'article' ? 'news' : item.content.type === 'video' ? 'watch' : item.content.type === 'show' ? 'shows' : item.content.type === 'event' ? 'events' : item.content.type === 'sponsored' ? 'sponsored' : item.content.type === 'music_show' ? 'music/shows' : ''}/${item.content.link_slug}`}
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                              onClick={() => handleRemoveFromPlaylist(item.id, item.content?.title || "item")}
                              aria-label={`Remove ${item.content.title} from playlist`}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default UserPlaylistsPage;