"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">Our Services</h1>
        <p className="text-xl text-gray-300">
          Explore the range of services we offer. (Content Coming Soon!)
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Services;