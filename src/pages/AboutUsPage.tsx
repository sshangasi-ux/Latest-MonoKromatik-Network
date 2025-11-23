"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-5xl font-heading font-extrabold mb-10 text-center uppercase tracking-tight text-primary">
          About MONO<span className="text-foreground">[KROMATIK]</span> NETWORK
        </h1>

        <section className="mb-16 text-center max-w-4xl mx-auto">
          <p className="text-xl text-muted-foreground mb-6 font-sans leading-relaxed">
            At MonoKromatik Network, we are more than just a platform; we are a vibrant ecosystem dedicated to showcasing the rich tapestry of African creativity, innovation, and culture to the world. Born from a passion to amplify authentic African voices, we strive to be the premier digital destination for compelling shows, insightful news, groundbreaking music, captivating videos, and unforgettable events from across the continent.
          </p>
          <p className="text-lg text-muted-foreground font-sans leading-relaxed">
            Our mission is to connect, inspire, and entertain a global audience by delivering high-quality, diverse content that reflects the dynamic spirit and untold stories of Africa. We believe in the power of storytelling to bridge divides, foster understanding, and celebrate the unique perspectives that make Africa truly extraordinary.
          </p>
        </section>

        <Separator className="my-12 bg-border" />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-card border-border text-foreground text-center p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-heading uppercase tracking-tight text-primary">Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="font-sans text-muted-foreground">
              To be the leading global platform for African content, recognized for our commitment to quality, authenticity, and cultural impact. We envision a world where African narratives are celebrated and accessible to everyone.
            </CardContent>
          </Card>
          <Card className="bg-card border-border text-foreground text-center p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-heading uppercase tracking-tight text-primary">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="font-sans text-muted-foreground">
              To empower African creators and storytellers by providing a robust platform for their work, fostering a community that values diverse perspectives, and delivering engaging content that resonates globally.
            </CardContent>
          </Card>
          <Card className="bg-card border-border text-foreground text-center p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-heading uppercase tracking-tight text-primary">Our Values</CardTitle>
            </CardHeader>
            <CardContent className="font-sans text-muted-foreground">
              Authenticity, Innovation, Community, Excellence, and Empowerment. These values guide every decision we make and every piece of content we curate.
            </CardContent>
          </Card>
        </section>

        <section className="mb-16 max-w-5xl mx-auto">
          <h2 className="text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight text-foreground">
            The MonoKromatik Difference
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground font-sans leading-relaxed">
                We are deeply committed to showcasing the full spectrum of African experiences. From the bustling streets of Lagos to the serene landscapes of the Serengeti, our content captures the essence of a continent on the rise. We partner with local talent, independent filmmakers, musicians, and journalists to bring you stories that are not only entertaining but also culturally significant.
              </p>
              <p className="text-lg text-muted-foreground font-sans leading-relaxed">
                Our platform is designed with you in mind, offering seamless navigation, personalized recommendations, and a vibrant community where you can engage with fellow enthusiasts. We are constantly evolving, integrating cutting-edge technology and innovative features to enhance your viewing and reading experience.
              </p>
            </div>
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-xl border border-border">
              <img
                src="https://via.placeholder.com/800x600/1a202c/FFFFFF?text=African+Creativity"
                alt="African Creativity"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 gradient-overlay" />
              <p className="absolute bottom-4 left-4 text-white text-xl font-heading font-bold uppercase">
                Celebrating African Voices
              </p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-4xl font-heading font-bold mb-8 uppercase tracking-tight text-foreground">
            Join Our Journey
          </h2>
          <p className="text-xl text-muted-foreground mb-8 font-sans">
            Be a part of the movement that brings African stories to the global stage. Explore, engage, and experience the future of African content with MonoKromatik Network.
          </p>
          <Link to="/shows" className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 rounded-lg uppercase font-semibold transition-all shadow-lg hover:scale-[1.02] hover:shadow-primary/20">
            Start Exploring
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUsPage;