"use client";

import React, { useEffect, useState } from "react";
import { fetchTickerMessages } from "@/lib/supabase";
import { dummyTickerMessages } from "@/data/dummyContent";

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
      <div className="bg-secondary text-foreground py-2 text-center">
        <span className="text-sm md:text-base mx-8 font-medium text-destructive">{error}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-secondary text-foreground py-2 overflow-hidden relative">
        <div className="animate-pulse bg-muted h-5 w-full"></div>
      </div>
    );
  }

  const messagesToDisplay = tickerMessages.length > 0 ? tickerMessages : dummyTickerMessages;

  if (messagesToDisplay.length === 0) {
    return null;
  }

  return (
    <div className="bg-secondary text-foreground py-2 overflow-hidden relative">
      <div className="animate-marquee whitespace-nowrap">
        {messagesToDisplay.map((msg, index) => (
          <span key={index} className="text-sm md:text-base mx-8 font-medium font-sans">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LiveTicker;