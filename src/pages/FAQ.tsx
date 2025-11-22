"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "What is MonoKromatik Network?",
    answer: "MonoKromatik Network is your ultimate hub for African sports, culture, music, fashion, and lifestyle content. We aim to bring you the most compelling stories and trends from across the continent.",
  },
  {
    question: "How can I watch shows and videos?",
    answer: "You can browse our 'Shows' and 'Video Spotlight' sections on the homepage or navigate to specific content pages. Some premium content may require a membership.",
  },
  {
    question: "Do I need a subscription to access content?",
    answer: "While much of our content is freely available, a membership unlocks exclusive premium content, ad-free viewing, and community perks. You can learn more on our 'Subscription' page.",
  },
  {
    question: "How can I search for specific content?",
    answer: "You can use the search bar in the header to find shows, articles, videos, or events by keywords. You can also browse content by 'Categories'.",
  },
  {
    question: "Is there a mobile app available?",
    answer: "We are currently working on developing a dedicated mobile application to enhance your viewing experience on the go. Stay tuned for updates!",
  },
  {
    question: "How can I contact customer support?",
    answer: "If you have any questions or need assistance, please visit our 'Contact Us' page for our email, phone number, and address. We're here to help!",
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-white uppercase">Frequently Asked Questions</h1>
        <div className="bg-neutral-900 p-6 rounded-lg shadow-md text-white">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-300">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;