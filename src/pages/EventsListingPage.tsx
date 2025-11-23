"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const EventsListingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8 text-center">
        <h1 className="text-4xl font-heading font-bold mb-4 uppercase tracking-tight">All Events</h1>
        <p className="text-xl text-muted-foreground mb-8 font-sans">
          Discover upcoming events and cultural gatherings.
        </p>
        <Link to="/" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
          Back to Home
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default EventsListingPage;