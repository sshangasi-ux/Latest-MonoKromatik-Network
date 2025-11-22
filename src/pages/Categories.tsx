"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
  { name: "Music", description: "Explore the vibrant rhythms of Africa.", link: "/category/music" },
  { name: "Tech", description: "Innovations and advancements shaping the future.", link: "/category/tech" },
  { name: "Fashion", description: "Bold designs and trends from the continent.", link: "/category/fashion" },
  { name: "Sports", description: "Celebrating athletes and sporting events.", link: "/category/sports" },
  { name: "Culture", description: "Rich traditions, art, and storytelling.", link: "/category/culture" },
  { name: "Nature", description: "Wildlife and natural wonders.", link: "/category/nature" },
  { name: "History", description: "Uncovering the past of the African continent.", link: "/category/history" },
  { name: "Business", description: "Entrepreneurial spirit and success stories.", link: "/category/business" },
  { name: "Lifestyle", description: "Travel, food, and everyday living.", link: "/category/lifestyle" },
];

const Categories = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-white uppercase">Content Categories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link to={category.link} key={category.name}>
              <Card className="h-full flex flex-col justify-between bg-neutral-900 text-white border-neutral-800 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;