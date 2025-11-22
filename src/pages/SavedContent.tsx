"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SavedContent = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <Header />
      <main className="flex-grow container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Saved Content</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Here you can find all your saved articles, shows, and videos. (Coming Soon!)
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default SavedContent;