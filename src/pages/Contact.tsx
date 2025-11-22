"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white uppercase">Contact Us</h1>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md text-gray-900 dark:text-white">
          <p className="text-lg mb-4">
            We'd love to hear from you! Whether you have a question, feedback, or a partnership inquiry, please don't hesitate to reach out.
          </p>
          <div className="space-y-2 text-lg">
            <p><strong>Email:</strong> info@monokromatiknetwork.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Address:</strong> 123 Africa Street, Global City, GC 12345</p>
          </div>
          <p className="text-lg mt-4">
            Our team is available Monday to Friday, 9 AM to 5 PM (GMT). We aim to respond to all inquiries within 24-48 hours.
          </p>
        </div>
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default Contact;