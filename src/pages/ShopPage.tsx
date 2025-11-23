"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ShoppingBag, Construction } from "lucide-react"; // Import icons
import { Button } from "@/components/ui/button";

const ShopPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8 flex flex-col items-center justify-center text-center">
        <ShoppingBag className="h-24 w-24 text-primary mb-6" />
        <h1 className="text-5xl font-heading font-extrabold mb-4 uppercase tracking-tight">
          Our Shop is Coming Soon!
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl font-sans leading-relaxed">
          Get ready to discover exclusive merchandise, unique products, and support your favorite African creators. We're working hard to bring you an amazing shopping experience!
        </p>
        <div className="flex items-center text-muted-foreground text-lg mb-10 font-sans">
          <Construction className="h-6 w-6 mr-2" />
          <span>Under Construction</span>
        </div>
        <p className="text-muted-foreground text-sm mb-8 max-w-xl font-sans">
          A full e-commerce integration is a significant feature that typically involves choosing a platform (e.g., Shopify, WooCommerce), setting up payment gateways (e.g., Stripe, PayPal), managing products, inventory, and orders. We can discuss a phased approach for this if you'd like to integrate it fully.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
          <Link to="/">Back to Home</Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPage;