"use client";

import React from "react";
import { MadeWithDyad } from "./made-with-dyad"; // Import MadeWithDyad

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm mb-2">
          &copy; {new Date().getFullYear()} MonoKromatik Network. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4 mb-2">
          <a href="/privacy" className="hover:text-white transition-colors text-sm">Privacy Policy</a>
          <a href="/terms" className="hover:text-white transition-colors text-sm">Terms of Service</a>
        </div>
        <MadeWithDyad />
      </div>
    </footer>
  );
};

export default Footer;