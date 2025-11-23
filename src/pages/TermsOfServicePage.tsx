"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center uppercase tracking-tight">
          Terms of Service
        </h1>

        <div className="prose dark:prose-invert max-w-none text-foreground prose-p:text-muted-foreground prose-h3:text-foreground prose-h2:text-foreground prose-a:text-primary hover:prose-a:text-primary/90 font-sans">
          <p className="text-destructive font-bold">
            Disclaimer: These Terms of Service content are for demonstration purposes only and are NOT legally binding. You MUST consult with legal professionals to draft actual, legally compliant Terms of Service specific to your business and target regions (including South African and international laws).
          </p>
          <br />

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the MonoKromatik Network website and services (the "Service"), you agree to be bound by these Terms of Service ("Terms"), all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on MonoKromatik Network's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            <ul>
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
              <li>attempt to decompile or reverse engineer any software contained on MonoKromatik Network's website;</li>
              <li>remove any copyright or other proprietary notations from the materials; or</li>
              <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
            This license shall automatically terminate if you violate any of these restrictions and may be terminated by MonoKromatik Network at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
          </p>

          <h2>3. Disclaimer</h2>
          <p>
            The materials on MonoKromatik Network's website are provided on an 'as is' basis. MonoKromatik Network makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p>
            Further, MonoKromatik Network does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
          </p>

          <h2>4. Limitations</h2>
          <p>
            In no event shall MonoKromatik Network or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on MonoKromatik Network's website, even if MonoKromatik Network or a MonoKromatik Network authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
          </p>

          <h2>5. Accuracy of Materials</h2>
          <p>
            The materials appearing on MonoKromatik Network's website could include technical, typographical, or photographic errors. MonoKromatik Network does not warrant that any of the materials on its website are accurate, complete or current. MonoKromatik Network may make changes to the materials contained on its website at any time without notice. However MonoKromatik Network does not make any commitment to update the materials.
          </p>

          <h2>6. Links</h2>
          <p>
            MonoKromatik Network has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by MonoKromatik Network of the site. Use of any such linked website is at the user's own risk.
          </p>

          <h2>7. Modifications</h2>
          <p>
            MonoKromatik Network may revise these Terms of Service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.
          </p>

          <h2>8. Governing Law (South Africa & International)</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of South Africa. You irrevocably submit to the exclusive jurisdiction of the courts in that State or location. Where international users are concerned, we also strive to comply with relevant international legal frameworks.
          </p>

          <h2>9. Contact Information</h2>
          <p>
            Questions about the Terms of Service should be sent to us at [Your Contact Email Address].
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

export default TermsOfServicePage;