"use client";

import React from "react";
import { tickerMessages } from "@/data/tickerMessages"; // New import

const LiveTicker = () => {
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