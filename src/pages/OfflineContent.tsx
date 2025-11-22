"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MadeWithDyad } from "@/components/made-with-dyad";

const OfflineContent = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <Header />
      <main className="flex-grow container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Offline Content</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Access and manage your downloaded content here. (Coming Soon!)
        </p>
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default OfflineContent;