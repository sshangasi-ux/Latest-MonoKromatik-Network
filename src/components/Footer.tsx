"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MadeWithDyad } from "./made-with-dyad";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react"; // Import Lucide icons
import { fetchContactInfo, ContactInfo } from "@/lib/supabase"; // Import fetchContactInfo and ContactInfo interface

const Footer = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    const getContactInfo = async () => {
      try {
        const info = await fetchContactInfo();
        setContactInfo(info);
      } catch (err) {
        console.error("Failed to fetch contact info for footer:", err);
      }
    };
    getContactInfo();
  }, []);

  return (
    <footer className="bg-secondary text-muted-foreground py-8 border-t border-border">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Info */}
        <div>
          <Link to="/" className="text-2xl font-heading font-extrabold uppercase text-foreground mb-4 block">
            MONO<span className="text-primary">[KROMATIK]</span> NETWORK
          </Link>
          <p className="text-sm">
            Your ultimate hub for African content, news, and entertainment.
          </p>
          <div className="flex space-x-4 mt-4">
            {/* Social Media Icons */}
            {contactInfo?.facebook_url && (
              <a href={contactInfo.facebook_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
            )}
            {contactInfo?.twitter_url && (
              <a href={contactInfo.twitter_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            )}
            {contactInfo?.instagram_url && (
              <a href={contactInfo.instagram_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            )}
            {contactInfo?.youtube_url && (
              <a href={contactInfo.youtube_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            )}
            {contactInfo?.linkedin_url && (
              <a href={contactInfo.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-heading font-semibold uppercase text-foreground mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors uppercase">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors uppercase">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors uppercase">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors uppercase">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info / Newsletter */}
        <div>
          <h3 className="text-lg font-heading font-semibold uppercase text-foreground mb-4">Stay Connected</h3>
          <p className="text-sm mb-4">
            Subscribe to our newsletter for the latest updates.
          </p>
          {/* Newsletter form placeholder */}
          <form className="flex">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="flex-grow px-4 py-2 rounded-l-md bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground uppercase text-sm"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-r-md transition-colors uppercase font-semibold text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-4">
        &copy; {new Date().getFullYear()} MONOKROMATIK NETWORK. All rights reserved.
        <MadeWithDyad />
      </div>
    </footer>
  );
};

export default Footer;