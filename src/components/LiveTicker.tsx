"use client";

import React from "react";

const LiveTicker = () => {
  // This would typically fetch dynamic content from an API
  const messages = [
    "Breaking News: African Tech Summit Kicks Off!",
    "New Music Drop: Artist Spotlight on Afrobeat Sensation!",
    "Live Event Alert: Football Derby This Weekend!",
    "Fashion Week Highlights: Emerging Designers Showcase!",
  ];

  return (
    <div className="bg-neutral-900 text-white py-2 overflow-hidden relative">
      <div className="animate-marquee whitespace-nowrap">
        {messages.map((msg, index) => (
          <span key={index} className="text-sm md:text-base mx-8 font-medium">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LiveTicker;