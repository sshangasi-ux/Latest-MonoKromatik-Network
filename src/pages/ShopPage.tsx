"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const ShopPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8 text-center">
        <h1 className="text-4xl font-heading font-bold mb-4 uppercase tracking-tight">Shop</h1>
        <p className="text-xl text-muted-foreground mb-8 font-sans">
          Discover exclusive merchandise and products. Our e-commerce store is launching soon!
        </p>
        <p className="text-muted-foreground text-sm mb-8 font-sans">
          A full e-commerce integration is a significant feature that typically involves choosing a platform (e.g., Shopify, WooCommerce), setting up payment gateways (e.g., Stripe, PayPal), managing products, inventory, and orders. We can discuss a phased approach for this if you'd like to integrate it fully.
        </p>
        <Link to="/" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
          Back to Home
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPage;