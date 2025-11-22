"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MadeWithDyad } from "@/components/made-with-dyad";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white uppercase">Privacy Policy</h1>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md text-gray-900 dark:text-white prose dark:prose-invert max-w-none">
          <p>
            This Privacy Policy describes how MonoKromatik Network ("we," "us," or "our") collects, uses, and discloses your personal information when you visit or make a purchase from our website.
          </p>
          <h2>Information We Collect</h2>
          <p>
            When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support. In this Privacy Policy, we refer to any information that can uniquely identify an individual (including the information below) as "Personal Information."
          </p>
          <h3>Device information</h3>
          <ul>
            <li><strong>Examples of Personal Information collected:</strong> version of web browser, IP address, time zone, cookie information, what sites or products you view, search terms, and how you interact with the Site.</li>
            <li><strong>Purpose of collection:</strong> to load the Site accurately for you, and to perform analytics on Site usage to optimize our Site.</li>
            <li><strong>Source of collection:</strong> Collected automatically when you access our Site using cookies, log files, web beacons, tags, or pixels.</li>
            <li><strong>Disclosure for a business purpose:</strong> shared with our processor.</li>
          </ul>
          <h3>Order information</h3>
          <ul>
            <li><strong>Examples of Personal Information collected:</strong> name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number.</li>
            <li><strong>Purpose of collection:</strong> to provide products or services to you to fulfill our contract, to process your payment information, arrange for shipping, and provide you with invoices and/or order confirmations, communicate with you, screen our orders for potential risk or fraud, and when in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</li>
            <li><strong>Source of collection:</strong> collected from you.</li>
            <li><strong>Disclosure for a business purpose:</strong> shared with our processor.</li>
          </ul>
          <h2>Sharing Personal Information</h2>
          <p>
            We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you, as described above. For example:
          </p>
          <ul>
            <li>We use analytics to help us understand how our customers use the Site.</li>
            <li>We may share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.</li>
          </ul>
          <h2>Your Rights</h2>
          <p>
            If you are a European resident, you have the right to access the Personal Information we hold about you and to ask that your Personal Information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
          </p>
          <h2>Changes</h2>
          <p>
            We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.
          </p>
          <h2>Contact</h2>
          <p>
            For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at info@monokromatiknetwork.com.
          </p>
        </div>
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default PrivacyPolicy;