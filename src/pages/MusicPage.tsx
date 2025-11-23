"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  dummyMusicPlaylists,
  dummyNewReleases,
  dummyMusicShows,
} from "@/data/dummyContent";
import MusicPlaylistCard from "@/components/MusicPlaylistCard";
import NewReleaseCard from "@/components/NewReleaseCard";
import ContentCard from "@/components/ContentCard";
import MusicPlayerEmbed from "@/components/MusicPlayerEmbed";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import { fetchContent } from "@/lib/supabase";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event" | "sponsored" | "music_show";
  link: string;
  music_embed_url?: string;
}

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork_url: string;
  embed_url: string;
}

interface MusicPlaylist {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  embed_url: string;
  genre: string;
}

const MusicPage = () => {
  const [currentPlayingEmbed, setCurrentPlayingEmbed] = useState<{
    url: string;
    title: string;
    height?: string;
  } | null>(null);
  const [musicShows, setMusicShows] = useState<ContentItem[]>([]);
  const [loadingMusicShows, setLoadingMusicShows] = useState(true);
  const [errorMusicShows, setErrorMusicShows] = useState<string | null>(null);

  useEffect(() => {
    const getMusicShows = async () => {
      setLoadingMusicShows(true);
      setErrorMusicShows(null);
      try {
        const { data } = await fetchContent('music_show', 6);
        if (data) {
          const mappedShows: ContentItem[] = data.map(item => ({
            ...item,
            link: `/music/shows/${item.link_slug}`,
          }));
          setMusicShows(mappedShows);
        } else {
          setMusicShows(dummyMusicShows.map(item => ({
            ...item,
            link: `/music/shows/${item.link_slug}`,
          })));
        }
      } catch (err) {
        console.error("Failed to fetch music shows:", err);
        setErrorMusicShows("Failed to load music shows. Please try again later.");
        setMusicShows(dummyMusicShows.map(item => ({
          ...item,
          link: `/music/shows/${item.link_slug}`,
        })));
      } finally {
        setLoadingMusicShows(false);
      }
    };

    getMusicShows();
  }, []);

  const handlePlayMusic = (embedUrl: string, title: string, height?: string) => {
    setCurrentPlayingEmbed({ url: embedUrl, title, height });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-5xl font-heading font-extrabold mb-10 text-center uppercase tracking-tight text-foreground">
          The Sound of Africa
        </h1>

        {/* Curated Playlists Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">
            Curated <span className="text-primary">Playlists</span>
          </h2>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {dummyMusicPlaylists.map((playlist: MusicPlaylist) => (
                <CarouselItem key={playlist.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <MusicPlaylistCard
                    title={playlist.title}
                    description={playlist.description}
                    coverUrl={playlist.cover_url}
                    genre={playlist.genre}
                    onPlay={() => handlePlayMusic(playlist.embed_url, playlist.title, "380")} // Larger embed for playlists
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary" />
            <CarouselNext className="right-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary" />
          </Carousel>
        </section>

        <Separator className="my-12 bg-border" />

        {/* New Music Releases Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">
            New <span className="text-primary">Releases</span>
          </h2>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {dummyNewReleases.map((track: MusicTrack) => (
                <CarouselItem key={track.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <NewReleaseCard
                    title={track.title}
                    artist={track.artist}
                    album={track.album}
                    artworkUrl={track.artwork_url}
                    onPlay={() => handlePlayMusic(track.embed_url, track.title, "80")} // Smaller embed for tracks
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary" />
            <CarouselNext className="right-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary" />
          </Carousel>
        </section>

        <Separator className="my-12 bg-border" />

        {/* Curated Music Shows Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">
            Curated <span className="text-primary">Music Shows</span>
          </h2>
          {errorMusicShows && (
            <div className="text-center text-destructive text-xl font-sans mb-8">{errorMusicShows}</div>
          )}
          {loadingMusicShows ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <ContentCardSkeleton key={index} />
              ))}
            </div>
          ) : musicShows.length === 0 ? (
            <div className="text-center text-muted-foreground text-xl font-sans">
              No music shows available at the moment.
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {musicShows.map((show) => (
                  <CarouselItem key={show.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <ContentCard
                      type="music_show"
                      title={show.title}
                      description={show.description}
                      imageUrl={show.image_url}
                      category={show.category}
                      link={show.link}
                      contentId={show.id} // Added contentId prop
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary" />
              <CarouselNext className="right-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary" />
            </Carousel>
          )}
        </section>

        <div className="text-center mt-10">
          <Link to="/" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />

      {currentPlayingEmbed && (
        <div className="fixed bottom-0 left-0 right-0 bg-secondary border-t border-border p-4 z-50 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <MusicPlayerEmbed
              embedUrl={currentPlayingEmbed.url}
              title={currentPlayingEmbed.title}
              height={currentPlayingEmbed.height}
            />
            <button
              onClick={() => setCurrentPlayingEmbed(null)}
              className="ml-4 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Close music player"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPage;