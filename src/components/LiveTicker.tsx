"use client";

import React, { useEffect, useState } from "react";
import { fetchTickerMessages } from "@/lib/supabase"; // New import

const LiveTicker = () => {
  const [tickerMessages, setTickerMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        setLoading(true);
        const messages = await fetchTickerMessages();
        setTickerMessages(messages);
      } catch (err) {
        console.error("Failed to fetch ticker messages:", err);
        setError("Failed to load ticker messages.");
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, []);

  if (error) {
    return (
      <div className="bg-neutral-900 text-white py-2 text-center">
        <span className="text-sm md:text-base mx-8 font-medium text-red-500">{error}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-neutral-900 text-white py-2 overflow-hidden relative">
        <div className="animate-pulse bg-neutral-800 h-5 w-full"></div>
      </div>
    );
  }

  if (tickerMessages.length === 0) {
    return null; // Don't render ticker if no messages
  }

  return (
    <div className="bg-neutral-900 text-white py-2 overflow-hidden relative">
      <div className="animate-marquee whitespace-nowrap">
        {tickerMessages.map((msg, index) => (
          <span key={index} className="text-sm md:text-base mx-8 font-medium">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LiveTicker;