"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";
import { fetchContactInfo, ContactInfo } from "@/lib/supabase";

const ContactUsPage = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getContactInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const info = await fetchContactInfo();
        setContactInfo(info);
      } catch (err) {
        console.error("Failed to fetch contact info:", err);
        setError("Failed to load contact information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getContactInfo();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">
          Get in Touch
        </h1>

        <p className="text-xl text-muted-foreground mb-10 text-center max-w-3xl mx-auto font-sans">
          We'd love to hear from you! Whether you have a question, feedback, or a partnership inquiry, reach out to us using the details below.
        </p>

        {loading ? (
          <div className="text-center text-muted-foreground text-lg font-sans">Loading contact information...</div>
        ) : error ? (
          <div className="text-center text-destructive text-xl font-sans">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactInfo?.email && (
              <Card className="bg-card border-border text-foreground text-center p-6 flex flex-col items-center justify-center">
                <Mail className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-xl font-heading uppercase tracking-tight mb-2">Email Us</CardTitle>
                <CardContent className="p-0">
                  <a href={`mailto:${contactInfo.email}`} className="text-muted-foreground hover:text-primary underline font-sans">
                    {contactInfo.email}
                  </a>
                </CardContent>
              </Card>
            )}

            {contactInfo?.phone && (
              <Card className="bg-card border-border text-foreground text-center p-6 flex flex-col items-center justify-center">
                <Phone className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-xl font-heading uppercase tracking-tight mb-2">Call Us</CardTitle>
                <CardContent className="p-0">
                  <a href={`tel:${contactInfo.phone}`} className="text-muted-foreground hover:text-primary underline font-sans">
                    {contactInfo.phone}
                  </a>
                </CardContent>
              </Card>
            )}

            {contactInfo?.address && (
              <Card className="bg-card border-border text-foreground text-center p-6 flex flex-col items-center justify-center">
                <MapPin className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-xl font-heading uppercase tracking-tight mb-2">Visit Us</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground font-sans">{contactInfo.address}</p>
                </CardContent>
              </Card>
            )}

            {(contactInfo?.facebook_url || contactInfo?.twitter_url || contactInfo?.instagram_url || contactInfo?.youtube_url || contactInfo?.linkedin_url) && (
              <Card className="bg-card border-border text-foreground text-center p-6 col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-xl font-heading uppercase tracking-tight mb-2">Connect on Social Media</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center space-x-6 p-0">
                  {contactInfo.facebook_url && (
                    <a href={contactInfo.facebook_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <Facebook className="h-8 w-8" />
                    </a>
                  )}
                  {contactInfo.twitter_url && (
                    <a href={contactInfo.twitter_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <Twitter className="h-8 w-8" />
                    </a>
                  )}
                  {contactInfo.instagram_url && (
                    <a href={contactInfo.instagram_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <Instagram className="h-8 w-8" />
                    </a>
                  )}
                  {contactInfo.youtube_url && (
                    <a href={contactInfo.youtube_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <Youtube className="h-8 w-8" />
                    </a>
                  )}
                  {contactInfo.linkedin_url && (
                    <a href={contactInfo.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <Linkedin className="h-8 w-8" />
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="mt-12 text-center text-muted-foreground text-sm font-sans">
          <p>
            To update this contact information, you would typically use a backend management interface (e.g., Supabase Studio, a custom admin panel) to modify the `contact_info` table.
          </p>
        </div>

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

export default ContactUsPage;