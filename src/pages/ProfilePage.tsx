"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from "@/components/ProfileForm";
import EmailUpdateForm from "@/components/EmailUpdateForm";
import PasswordUpdateForm from "@/components/PasswordUpdateForm";
import UserPreferencesForm from "@/components/UserPreferencesForm"; // Import new component
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserProgress } from "@/lib/supabase";
import ContentCard from "@/components/ContentCard";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import { Progress } from "@/components/ui/progress";
import { User as UserIcon } from "lucide-react";

interface ContentItemWithProgress {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link_slug: string;
  type: "show" | "video" | "article" | "event" | "sponsored" | "music_show"; // Added 'music_show'
  link: string;
  progress_data?: {
    time?: number;
    percentage?: number;
  };
}

const ProfilePage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [progressItems, setProgressItems] = useState<ContentItemWithProgress[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [progressError, setProgressError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const getProgress = async () => {
      if (!user) {
        setLoadingProgress(false);
        return;
      }

      setLoadingProgress(true);
      setProgressError(null);
      try {
        const fetchedProgress = await fetchUserProgress(user.id, 10); // Fetch more items for profile page

        const itemsWithLinks: ContentItemWithProgress[] = fetchedProgress
          .filter(p => p.content)
          .map((p: any) => {
            let linkPrefix = '';
            switch (p.content.type) {
              case 'show': linkPrefix = '/shows'; break;
              case 'video': linkPrefix = '/watch'; break;
              case 'article': linkPrefix = '/news'; break;
              case 'event': linkPrefix = '/events'; break;
              case 'sponsored': linkPrefix = '/sponsored'; break;
              case 'music_show': linkPrefix = '/music/shows'; break; // Added 'music_show'
              default: linkPrefix = '';
            }
            return {
              ...p.content,
              link: `${linkPrefix}/${p.content.link_slug}`,
              progress_data: p.progress_data,
            };
          });
        setProgressItems(itemsWithLinks);
      } catch (err) {
        console.error("Failed to fetch user progress:", err);
        setProgressError("Failed to load your progress. Please try again later.");
      } finally {
        setLoadingProgress(false);
      }
    };

    if (isAuthenticated && user) {
      getProgress();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return null; // Or a loading spinner, as redirect happens in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">
          My Profile
        </h1>

        <Tabs defaultValue="profile" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 bg-secondary border-border"> {/* Increased grid-cols to 4 */}
            <TabsTrigger value="profile" className="uppercase font-semibold text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Profile Details</TabsTrigger>
            <TabsTrigger value="security" className="uppercase font-semibold text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Security</TabsTrigger>
            <TabsTrigger value="preferences" className="uppercase font-semibold text-sm data-[state=active]:bg-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Preferences</TabsTrigger> {/* New Tab Trigger */}
            <TabsTrigger value="progress" className="uppercase font-semibold text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">My Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card className="bg-card border-border text-foreground">
              <CardHeader>
                <CardTitle className="font-heading uppercase tracking-tight">Profile Information</CardTitle>
                <CardDescription className="font-sans">
                  Update your account's profile information and avatar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card className="bg-card border-border text-foreground">
              <CardHeader>
                <CardTitle className="font-heading uppercase tracking-tight">Security Settings</CardTitle>
                <CardDescription className="font-sans">
                  Change your email address or password.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <EmailUpdateForm />
                <div className="border-t border-border pt-6" />
                <PasswordUpdateForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6"> {/* New Tab Content */}
            <Card className="bg-card border-border text-foreground">
              <CardHeader>
                <CardTitle className="font-heading uppercase tracking-tight">Content Preferences</CardTitle>
                <CardDescription className="font-sans">
                  Tell us what you love to watch and read to get better recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <UserPreferencesForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <Card className="bg-card border-border text-foreground">
              <CardHeader>
                <CardTitle className="font-heading uppercase tracking-tight">My Content Progress</CardTitle>
                <CardDescription className="font-sans">
                  Content you've started watching or reading.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingProgress ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <ContentCardSkeleton key={index} />
                    ))}
                  </div>
                ) : progressError ? (
                  <p className="text-destructive text-center font-sans">{progressError}</p>
                ) : progressItems.length === 0 ? (
                  <p className="text-muted-foreground text-center font-sans">
                    You haven't started any content yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {progressItems.map((item) => (
                      <Link to={item.link} key={item.id} className="block h-full relative group">
                        <ContentCard
                          type={item.type}
                          title={item.title}
                          description={item.description}
                          imageUrl={item.image_url}
                          category={item.category}
                          link={item.link}
                          contentId={item.id} // Added contentId prop
                        />
                        {(item.progress_data?.percentage !== undefined || item.progress_data?.time !== undefined) && (
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/70 to-transparent">
                            <Progress
                              value={item.progress_data?.percentage !== undefined ? item.progress_data.percentage * 100 : 0}
                              className="h-2 bg-muted"
                              indicatorClassName="bg-primary"
                            />
                            <p className="text-xs text-muted-foreground mt-1 font-sans">
                              {item.progress_data?.percentage !== undefined
                                ? `${Math.round(item.progress_data.percentage * 100)}% Read`
                                : "Started"}
                            </p>
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;