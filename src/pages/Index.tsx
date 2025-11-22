"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; // Import the new Footer component

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center p-4">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to MonoKromatik Network</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your hub for creative solutions.
          </p>
        </div>
      </main>
      <Footer /> {/* Render the Footer component */}
      <MadeWithDyad />
    </div>
  );
};

export default Index;