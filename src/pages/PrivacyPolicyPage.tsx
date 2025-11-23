"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">
          Privacy Policy
        </h1>

        <div className="prose dark:prose-invert max-w-none text-foreground prose-p:text-muted-foreground prose-h3:text-foreground prose-h2:text-foreground prose-a:text-primary hover:prose-a:text-primary/90 font-sans">
          <p className="text-destructive font-bold">
            Disclaimer: This Privacy Policy content is for demonstration purposes only and is NOT legally binding. You MUST consult with legal professionals to draft an actual, legally compliant Privacy Policy specific to your business, data handling practices, and target regions (including South African and international laws).
          </p>
          <br />

          <h2>1. Introduction</h2>
          <p>
            Welcome to MonoKromatik Network. We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you visit our website and use our services.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>2.1. Personal Information</h3>
          <p>
            We may collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use.
          </p>
          <p>
            This may include:
            <ul>
              <li>Name and contact data (e.g., email address, phone number)</li>
              <li>Account credentials (e.g., usernames, passwords)</li>
              <li>Profile data (e.g., avatar URL, preferences)</li>
              <li>Payment data (if applicable, though processed by third parties)</li>
            </ul>
          </p>
          <h3>2.2. Usage Data</h3>
          <p>
            We automatically collect certain information when you visit, use, or navigate the website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our website and other technical information.
          </p>
          <h3>2.3. Cookies and Tracking Technologies</h3>
          <p>
            We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy (if applicable).
          </p>

          <h2>3. How We Use Your Information</h2>
          <p>
            We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <p>
            We use the information we collect or receive:
            <ul>
              <li>To facilitate account creation and login process.</li>
              <li>To send you marketing and promotional communications.</li>
              <li>To deliver and facilitate delivery of services to the user.</li>
              <li>To respond to user inquiries/offer support to users.</li>
              <li>To enable user-to-user communications.</li>
              <li>To request feedback.</li>
              <li>To protect our services.</li>
              <li>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
            </ul>
          </p>

          <h2>4. Sharing Your Information</h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis:
            <ul>
              <li><strong>Consent:</strong> We may process your data if you have given us specific consent to use your personal information for a specific purpose.</li>
              <li><strong>Legitimate Interests:</strong> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li>
              <li><strong>Performance of a Contract:</strong> Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.</li>
              <li><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
              <li><strong>Vital Interests:</strong> We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved.</li>
            </ul>
          </p>

          <h2>5. International Data Transfers (South Africa & Global)</h2>
          <p>
            Your information, including personal data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those from your jurisdiction.
          </p>
          <p>
            If you are located in South Africa, we comply with the Protection of Personal Information Act (POPIA). When we transfer your personal information outside of South Africa, we will ensure that appropriate safeguards are in place to protect your data, such as standard contractual clauses or reliance on adequacy decisions.
          </p>

          <h2>6. Your Privacy Rights</h2>
          <p>
            Depending on your location, you may have the following rights regarding your personal information:
            <ul>
              <li>The right to access your personal information.</li>
              <li>The right to request correction of your personal information.</li>
              <li>The right to request erasure of your personal information.</li>
              <li>The right to object to processing of your personal information.</li>
              <li>The right to request restriction of processing your personal information.</li>
              <li>The right to data portability.</li>
              <li>The right to withdraw consent.</li>
            </ul>
            To exercise any of these rights, please contact us using the details provided below.
          </p>

          <h2>7. Data Retention</h2>
          <p>
            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).
          </p>

          <h2>8. Security of Your Information</h2>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information.
          </p>

          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions or comments about this policy, you may contact us at:
            <br />
            [Your Contact Email Address]
            <br />
            [Your Physical Address, if applicable]
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;