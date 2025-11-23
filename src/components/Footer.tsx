"use client";

import React from "react";
import { Link } from "react-router-dom";
import { MadeWithDyad } from "./made-with-dyad";

const Footer = () => {
  return (
    <footer className="bg-background text-muted-foreground py-8 border-t border-border">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Info */}
        <div>
          <Link to="/" className="text-2xl font-bold text-primary mb-4 block">
            MonoKromatik Network
          </Link>
          <p className="text-sm">
            Your ultimate hub for African content, news, and entertainment.
          </p>
          <div className="flex space-x-4 mt-4">
            {/* Social Media Icons Placeholder */}
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.24.195 2.24.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z"></path></svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.814L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.866 8.143 6.839 9.489.5.092.682-.217.682-.483 0-.237-.007-.867-.012-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.007.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.089 2.904.833.091-.647.35-1.089.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.27.098-2.65 0 0 .84-.27 2.75 1.025A9.434 9.434 0 0112 6.8c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.025 2.747-1.025.546 1.38.202 2.398.099 2.65.64.698 1.028 1.591 1.028 2.682 0 3.841-2.339 4.687-4.566 4.935.359.307.678.915.678 1.846 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.482C21.137 20.11 24 16.385 24 12c0-5.523-4.477-10-10-10z"></path></svg>
              GitHub
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="text-sm hover:text-primary transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-sm hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-sm hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info / Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4">Stay Connected</h3>
          <p className="text-sm mb-4">
            Subscribe to our newsletter for the latest updates.
          </p>
          {/* Newsletter form placeholder */}
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-grow px-4 py-2 rounded-l-md bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-r-md transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-4">
        &copy; {new Date().getFullYear()} MonoKromatik Network. All rights reserved.
        <MadeWithDyad />
      </div>
    </footer>
  );
};

export default Footer;