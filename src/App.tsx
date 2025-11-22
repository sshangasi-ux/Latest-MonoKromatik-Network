import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import MyFeed from "./pages/MyFeed";
import SavedContent from "./pages/SavedContent";
import UserSettings from "./pages/UserSettings";
import Subscription from "./pages/Subscription";
import OfflineContent from "./pages/OfflineContent";
import Logout from "./pages/Logout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FAQ from "./pages/FAQ";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Shows from "./pages/Shows";
import Articles from "./pages/Articles";
import ContentDetailPage from "./pages/ContentDetailPage";
import Categories from "./pages/Categories";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import ScrollToTopButton from "./components/ScrollToTopButton"; // New import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/shows" element={<Shows />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:categoryName" element={<CategoryDetailPage />} />
              {/* Dynamic routes for content detail pages */}
              <Route path="/shows/:id" element={<ContentDetailPage />} />
              <Route path="/watch/:id" element={<ContentDetailPage />} />
              <Route path="/news/:id" element={<ContentDetailPage />} />
              <Route path="/events/:id" element={<ContentDetailPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/my-feed" element={<MyFeed />} />
                <Route path="/saved-content" element={<SavedContent />} />
                <Route path="/settings" element={<UserSettings />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/offline-content" element={<OfflineContent />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ScrollToTopButton /> {/* Render the scroll to top button */}
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;