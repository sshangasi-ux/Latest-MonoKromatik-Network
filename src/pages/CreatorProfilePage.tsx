"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import PaginationControls from "@/components/PaginationControls";
import { fetchCreatorProfile, fetchContentByCreator, CreatorProfile } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Globe, Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event" | "sponsored" | "music_show";
  link: string;
  creator_id?: string;
  creator_name?: string;
}

const ITEMS_PER_PAGE = 9;

const CreatorProfilePage: React.FC = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loadingCreator, setLoadingCreator] = useState(true);
  const [loadingContent, setLoadingContent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getCreatorData = async () => {
      if (!creatorId) {
        setError("Creator ID is missing.");
        setLoadingCreator(false);
        setLoadingContent(false);
        return;
      }

      setLoadingCreator(true);
      setError(null);
      try {
        const profile = await fetchCreatorProfile(creatorId);
        if (profile) {
          setCreator(profile);
        } else {
          setError("Creator not found.");
        }
      } catch (err) {
        console.error("Failed to fetch creator profile:", err);
        setError("Failed to load creator profile. Please try again later.");
      } finally {
        setLoadingCreator(false);
      }
    };

    getCreatorData();
  }, [creatorId]);

  useEffect(() => {
    const getCreatorContent = async () => {
      if (!creatorId) return;

      setLoadingContent(true);
      try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const { data, count } = await fetchContentByCreator(creatorId, ITEMS_PER_PAGE, offset);

        if (data) {
          const mappedContent: ContentItem[] = data.map(item => {
            let linkPrefix = '';
            switch (item.type) {
              case 'show': linkPrefix = '/shows'; break;
              case 'video': linkPrefix = '/watch'; break;
              case 'article': linkPrefix = '/news'; break;
              case 'event': linkPrefix = '/events'; break;
              case 'sponsored': linkPrefix = '/sponsored'; break;
              case 'music_show': linkPrefix = '/music/shows'; break;
              default: linkPrefix = '';
            }
            return { ...item, link: `${linkPrefix}/${item.link_slug}` };
          });
          setContent(mappedContent);
          setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
        }
      } catch (err) {
        console.error("Failed to fetch creator content:", err);
        // setError("Failed to load creator's content. Please try again later."); // Don't overwrite main error
      } finally {
        setLoadingContent(false);
      }
    };

    if (creatorId) {
      getCreatorContent();
    }
  }, [creatorId, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loadingCreator) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-grow container mx-auto p-8">
          <div className="flex flex-col items-center mb-12">
            <Avatar className="h-32 w-32 mb-4 border-4 border-primary animate-pulse">
              <AvatarFallback className="bg-muted text-muted-foreground text-5xl">
                <UserIcon className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
            <div className="h-8 w-64 bg-muted-foreground rounded mb-2 animate-pulse"></div>
            <div className="h-5 w-48 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-grow container mx-auto p-8 text-center">
          <h1 className="text-4xl font-heading font-bold mb-4 text-foreground uppercase tracking-tight">Error</h1>
          <p className="text-xl text-destructive mb-4 font-sans">{error}</p>
          <Link to="/" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
            Return to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-grow container mx-auto p-8 text-center">
          <h1 className="text-4xl font-heading font-bold mb-4 text-foreground uppercase tracking-tight">
            Creator Not Found
          </h1>
          <p className="text-xl text-muted-foreground mb-4 font-sans">
            The creator you are looking for does not exist.
          </p>
          <Link to="/" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
            Return to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <div className="flex flex-col items-center mb-12 text-center">
          <Avatar className="h-32 w-32 mb-4 border-4 border-primary">
            <AvatarImage src={creator.avatar_url || undefined} alt={creator.full_name} />
            <AvatarFallback className="bg-muted text-muted-foreground text-5xl">
              {creator.full_name ? creator.full_name.charAt(0).toUpperCase() : <UserIcon className="h-16 w-16" />}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-5xl font-heading font-extrabold mb-2 uppercase tracking-tight">
            {creator.full_name}
          </h1>
          {creator.bio && (
            <p className="text-lg text-muted-foreground max-w-2xl font-sans mb-4">
              {creator.bio}
            </p>
          )}
          <div className="flex space-x-4 mt-4">
            {creator.website_url && (
              <Button asChild variant="outline" size="icon" className="border-border text-foreground hover:bg-secondary hover:text-primary">
                <a href={creator.website_url} target="_blank" rel="noopener noreferrer" aria-label="Creator's Website">
                  <Globe className="h-5 w-5" />
                </a>
              </Button>
            )}
            {creator.social_links?.facebook && (
              <Button asChild variant="outline" size="icon" className="border-border text-foreground hover:bg-secondary hover:text-primary">
                <a href={creator.social_links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
            )}
            {creator.social_links?.twitter && (
              <Button asChild variant="outline" size="icon" className="border-border text-foreground hover:bg-secondary hover:text-primary">
                <a href={creator.social_links.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
            )}
            {creator.social_links?.instagram && (
              <Button asChild variant="outline" size="icon" className="border-border text-foreground hover:bg-secondary hover:text-primary">
                <a href={creator.social_links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
            )}
            {creator.social_links?.youtube && (
              <Button asChild variant="outline" size="icon" className="border-border text-foreground hover:bg-secondary hover:text-primary">
                <a href={creator.social_links.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <Youtube className="h-5 w-5" />
                </a>
              </Button>
            )}
            {creator.social_links?.linkedin && (
              <Button asChild variant="outline" size="icon" className="border-border text-foreground hover:bg-secondary hover:text-primary">
                <a href={creator.social_links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            )}
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">
          Content by {creator.full_name}
        </h2>

        {loadingContent ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        ) : content.length === 0 ? (
          <div className="text-center text-muted-foreground text-xl font-sans">
            No content available from this creator yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <ContentCard
                key={item.id}
                contentId={item.id}
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

        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
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

export default CreatorProfilePage;