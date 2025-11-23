"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const ShowsListingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8 text-center">
        <h1 className="text-4xl font-heading font-bold mb-4 uppercase tracking-tight">All Shows</h1>
        <p className="text-xl text-muted-foreground mb-8 font-sans">
          A comprehensive list of all our premium shows will appear here.
        </p>
        <Link to="/" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
          Back to Home
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default ShowsListingPage;