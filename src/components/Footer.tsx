"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 px-4 md:px-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
        {/* Logo and Copyright */}
        <div className="text-center md:text-left">
          <Link to="/" className="text-2xl font-bold text-white mb-2 block">
            mono KROMATIC
          </Link>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} MonoKromatik Network. All rights reserved.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
            About Us
          </Link>
          <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
            Contact Us
          </Link>
          <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
            Terms of Service
          </Link>
          <Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
            FAQ
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;