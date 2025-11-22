"use client";

import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  featuredShows,
  videoSpotlights,
  recentArticles,
  upcomingEvents,
} from "@/data/content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ContentDetailPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();

  let contentItem:
    | {
        id: string;
        title: string;
        description: string;
        imageUrl: string;
        category: string;
        link: string;
      }
    | undefined;

  switch (type) {
    case "shows":
      contentItem = featuredShows.find((item) => item.id === id);
      break;
    case "watch":
      contentItem = videoSpotlights.find((item) => item.id === id);
      break;
    case "news":
      contentItem = recentArticles.find((item) => item.id === id);
      break;
    case "events":
      contentItem = upcomingEvents.find((item) => item.id === id);
      break;
    default:
      contentItem = undefined;
  }

  if (!contentItem) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Header />
        <main className="flex-grow container mx-auto p-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Content Not Found
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            The content you are looking for does not exist.
          </p>
          <Link to="/" className="text-red-500 hover:text-red-400 underline">
            Return to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <div className="bg-neutral-900 rounded-lg shadow-lg overflow-hidden md:flex border border-neutral-800">
          <div className="md:w-1/2">
            <img
              src={contentItem.imageUrl}
              alt={contentItem.title}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-6 flex flex-col justify-center">
            <Badge className="bg-red-600 hover:bg-red-700 text-white uppercase text-sm px-3 py-1 self-start mb-4">
              {contentItem.category}
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-4">
              {contentItem.title}
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              {contentItem.description}
            </p>
            <div className="flex space-x-4">
              <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-3 rounded-lg uppercase font-bold transition-colors">
                Watch Now
              </Button>
              <Button variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800 text-lg px-6 py-3 rounded-lg uppercase font-bold transition-colors">
                Share
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link to="/" className="text-red-500 hover:text-red-400 underline">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContentDetailPage;