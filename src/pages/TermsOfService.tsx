"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-white uppercase">Terms of Service</h1>
        <div className="bg-neutral-900 p-6 rounded-lg shadow-md text-white prose dark:prose-invert max-w-none">
          <p>
            Welcome to MonoKromatik Network. By accessing or using our website and services, you agree to be bound by these Terms of Service ("Terms"). Please read them carefully.
          </p>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By using the MonoKromatik Network website (the "Service"), you agree to comply with and be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service.
          </p>
          <h2>2. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          <h2>3. Access to the Service</h2>
          <p>
            Access to the Service is permitted on a temporary basis, and we reserve the right to withdraw or amend the service without notice. We will not be liable if for any reason our site is unavailable at any time or for any period.
          </p>
          <h2>4. User Accounts</h2>
          <p>
            To access certain features of the Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
          </p>
          <h2>5. Intellectual Property</h2>
          <p>
            All content on the Service, including text, graphics, logos, images, and software, is the property of MonoKromatik Network or its content suppliers and protected by international copyright laws.
          </p>
          <h2>6. Prohibited Uses</h2>
          <p>
            You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, overburden, or impair the Service.
          </p>
          <h2>7. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the operation of the Service or the information, content, materials, or products included on the Service.
          </p>
          <h2>8. Limitation of Liability</h2>
          <p>
            In no event shall MonoKromatik Network, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
          </p>
          <h2>10. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at info@monokromatiknetwork.com.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;