"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { UploadCloud, Database, Code, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

const SubmitContentPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8 flex flex-col items-center justify-center text-center">
        <UploadCloud className="h-24 w-24 text-primary mb-6" />
        <h1 className="text-5xl font-heading font-extrabold mb-4 uppercase tracking-tight">
          Submit Your Content
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl font-sans leading-relaxed">
          We're excited for you to share your stories, videos, articles, and events with the MonoKromatik Network community!
        </p>
        <div className="space-y-6 max-w-xl mx-auto text-left mb-10">
          <div className="flex items-start space-x-4 bg-secondary p-4 rounded-lg border border-border">
            <Database className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-heading font-semibold uppercase tracking-tight text-foreground">Database Integration</h3>
              <p className="text-muted-foreground text-sm font-sans">
                A full content submission system requires a robust backend to store content details (title, description, category, etc.) in your Supabase database.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 bg-secondary p-4 rounded-lg border border-border">
            <UploadCloud className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-heading font-semibold uppercase tracking-tight text-foreground">File Uploads (Supabase Storage)</h3>
              <p className="text-muted-foreground text-sm font-sans">
                For images and videos, we'd integrate with Supabase Storage, allowing users to upload media files securely. This involves handling file types, sizes, and public/private access.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 bg-secondary p-4 rounded-lg border border-border">
            <Code className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-heading font-semibold uppercase tracking-tight text-foreground">Frontend Forms & Validation</h3>
              <p className="text-muted-foreground text-sm font-sans">
                Building user-friendly forms with input fields, text areas, category selectors, and client-side validation to ensure data quality before submission.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 bg-secondary p-4 rounded-lg border border-border">
            <LayoutDashboard className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-heading font-semibold uppercase tracking-tight text-foreground">Creator Dashboard & Moderation</h3>
              <p className="text-muted-foreground text-sm font-sans">
                A complete system would include a dashboard for creators to view and manage their submitted content, and potentially a moderation workflow for administrators.
              </p>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-8 max-w-xl font-sans">
          This feature requires significant backend and frontend development. We can discuss a phased approach to implement this fully when you're ready to dive deeper into content creation tools.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
          <Link to="/">Back to Home</Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitContentPage;