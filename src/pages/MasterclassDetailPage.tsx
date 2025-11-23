"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchMasterclassBySlug, enrollInMasterclass, isUserEnrolled, updateMasterclassProgress, Masterclass } from "@/lib/masterclasses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { User, Clock, DollarSign, CheckCircle2, PlayCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { dummyMasterclasses } from "@/data/dummyContent";

const MasterclassDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();
  const [masterclass, setMasterclass] = useState<Masterclass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0); // Placeholder for actual progress

  const checkEnrollmentStatus = useCallback(async () => {
    if (!user || !masterclass) {
      setIsEnrolled(false);
      return;
    }
    try {
      const enrolled = await isUserEnrolled(user.id, masterclass.id);
      setIsEnrolled(enrolled);
      // In a real app, you'd also fetch the actual progress percentage here
    } catch (err) {
      console.error("Failed to check enrollment status:", err);
      setIsEnrolled(false);
    }
  }, [user, masterclass]);

  useEffect(() => {
    const getMasterclass = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!slug) {
          setError("Masterclass slug is missing.");
          setLoading(false);
          return;
        }
        const fetchedMasterclass = await fetchMasterclassBySlug(slug);
        if (fetchedMasterclass) {
          setMasterclass(fetchedMasterclass);
        } else {
          // Fallback to dummy data if not found in Supabase
          const dummy = dummyMasterclasses.find(mc => mc.link_slug === slug);
          if (dummy) {
            setMasterclass(dummy);
          } else {
            setError("Masterclass not found.");
          }
        }
      } catch (err) {
        console.error("Failed to fetch masterclass:", err);
        setError("Failed to load masterclass details. Please try again later.");
        // Fallback to dummy data on error
        const dummy = dummyMasterclasses.find(mc => mc.link_slug === slug);
        if (dummy) {
          setMasterclass(dummy);
        } else {
          setError("Masterclass not found.");
        }
      } finally {
        setLoading(false);
      }
    };

    getMasterclass();
  }, [slug]);

  useEffect(() => {
    if (masterclass && user) {
      checkEnrollmentStatus();
    }
  }, [masterclass, user, checkEnrollmentStatus]);

  const handleEnroll = async () => {
    if (!isAuthenticated || !user || !masterclass) {
      toast.info("Please log in to enroll in a masterclass.");
      return;
    }
    setEnrollmentLoading(true);
    try {
      await enrollInMasterclass(user.id, masterclass.id);
      setIsEnrolled(true);
      toast.success(`Successfully enrolled in "${masterclass.title}"!`);
    } catch (err: any) {
      toast.error(`Failed to enroll: ${err.message}`);
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // Placeholder for updating progress (e.g., after watching a video segment)
  const handleUpdateProgress = async (newProgress: number) => {
    if (!user || !masterclass || !isEnrolled) return;
    // In a real app, you'd fetch the enrollment ID first
    // For now, this is a conceptual placeholder
    console.log(`Updating progress for ${masterclass.title} to ${newProgress}%`);
    setProgressPercentage(newProgress); // Optimistic update
    // await updateMasterclassProgress(enrollmentId, newProgress);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-grow container mx-auto p-8">
          <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
            <div className="w-full h-64 md:h-96 bg-muted animate-pulse"></div>
            <div className="p-6">
              <div className="h-6 w-24 bg-muted-foreground rounded mb-4 animate-pulse"></div>
              <div className="h-10 w-3/4 bg-muted-foreground rounded mb-4 animate-pulse"></div>
              <div className="h-6 w-full bg-muted rounded mb-6 animate-pulse"></div>
              <div className="h-6 w-5/6 bg-muted rounded mb-8 animate-pulse"></div>
              <div className="h-40 w-full bg-muted rounded animate-pulse"></div>
            </div>
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

  if (!masterclass) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-grow container mx-auto p-8 text-center">
          <h1 className="text-4xl font-heading font-bold mb-4 text-foreground uppercase tracking-tight">
            Masterclass Not Found
          </h1>
          <p className="text-xl text-muted-foreground mb-4 font-sans">
            The masterclass you are looking for does not exist.
          </p>
          <Link to="/masterclasses" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
            View All Masterclasses
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
        <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={masterclass.video_url}
              title={masterclass.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase text-sm px-3 py-1 self-start font-semibold">
                {masterclass.category}
              </Badge>
              <div className="flex items-center space-x-4 text-muted-foreground text-sm font-sans">
                {masterclass.duration_minutes && (
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> {masterclass.duration_minutes} min
                  </span>
                )}
                {masterclass.price !== undefined && masterclass.price !== null && (
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" /> {masterclass.price === 0 ? "Free" : masterclass.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4 uppercase tracking-tight">
              {masterclass.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6 font-sans">
              {masterclass.description}
            </p>

            {masterclass.instructor && (
              <div className="flex items-center space-x-3 mb-8 p-4 bg-secondary rounded-lg border border-border">
                <User className="h-6 w-6 text-primary" />
                <p className="text-foreground font-semibold uppercase text-sm">
                  Instructor:{" "}
                  <Link to={`/creators/${masterclass.instructor.id}`} className="text-primary hover:underline">
                    {masterclass.instructor.full_name}
                  </Link>
                </p>
              </div>
            )}

            <div className="mb-8">
              {isEnrolled ? (
                <div className="flex items-center space-x-4">
                  <Button disabled className="bg-green-600 text-white text-lg px-6 py-3 rounded-lg uppercase font-semibold">
                    <CheckCircle2 className="h-5 w-5 mr-2" /> Enrolled
                  </Button>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold">
                    <PlayCircle className="h-5 w-5 mr-2" /> Continue Learning
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleEnroll}
                  disabled={enrollmentLoading || !isAuthenticated}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20"
                >
                  {enrollmentLoading ? "Enrolling..." : "Enroll Now"}
                </Button>
              )}
              {!isAuthenticated && (
                <p className="text-muted-foreground text-sm mt-2 font-sans">
                  <Link to="/login" className="text-primary hover:underline">Log in</Link> to enroll.
                </p>
              )}
            </div>

            {isEnrolled && (
              <div className="mt-8 p-4 bg-secondary rounded-lg border border-border">
                <h3 className="text-xl font-heading font-bold mb-4 uppercase tracking-tight">Your Progress</h3>
                <Progress value={progressPercentage} className="h-3 bg-muted" indicatorClassName="bg-primary" />
                <p className="text-sm text-muted-foreground mt-2 font-sans">{progressPercentage}% Completed</p>
                {/* Example of a button to simulate progress update */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateProgress(Math.min(100, progressPercentage + 10))}
                  className="mt-4 bg-input border-border text-foreground hover:bg-primary hover:text-primary-foreground uppercase text-sm"
                >
                  Mark 10% Complete (Demo)
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/masterclasses" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
            Back to All Masterclasses
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MasterclassDetailPage;