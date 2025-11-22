"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // In a real application, you would send this email to a backend service
      console.log("Newsletter signup with:", email);
      toast.success("Thank you for subscribing to our newsletter!");
      setEmail("");
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h3 className="text-lg font-semibold mb-2 text-center md:text-left">Subscribe to Our Newsletter</h3>
      <p className="text-gray-400 text-sm mb-4 text-center md:text-left">
        Get the latest news and updates directly in your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder="Your email address"
          className="flex-grow bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus:ring-red-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold">
          Subscribe
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSignup;