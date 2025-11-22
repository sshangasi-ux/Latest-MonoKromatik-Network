import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import MyFeed from "./pages/MyFeed";
import SavedContent from "./pages/SavedContent";
import UserSettings from "./pages/UserSettings";
import Subscription from "./pages/Subscription";
import OfflineContent from "./pages/OfflineContent";
import Logout from "./pages/Logout";
import About from "./pages/About"; // New import
import Contact from "./pages/Contact"; // New import
import Services from "./pages/Services"; // New import
import PrivacyPolicy from "./pages/PrivacyPolicy"; // New import
import TermsOfService from "./pages/TermsOfService"; // New import
import FAQ from "./pages/FAQ"; // New import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-feed" element={<MyFeed />} />
          <Route path="/saved-content" element={<SavedContent />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/offline-content" element={<OfflineContent />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/about" element={<About />} /> {/* New route */}
          <Route path="/contact" element={<Contact />} /> {/* New route */}
          <Route path="/services" element={<Services />} /> {/* New route */}
          <Route path="/privacy" element={<PrivacyPolicy />} /> {/* New route */}
          <Route path="/terms" element={<TermsOfService />} /> {/* New route */}
          <Route path="/faq" element={<FAQ />} /> {/* New route */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;