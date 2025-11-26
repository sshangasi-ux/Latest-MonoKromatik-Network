import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes"; // Import ThemeProvider
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";
import ContentDetailPage from "./pages/ContentDetailPage";
import MusicPage from "./pages/MusicPage";
import ShopPage from "./pages/ShopPage";
import ShowsListingPage from "./pages/ShowsListingPage";
import NewsListingPage from "./pages/NewsListingPage";
import WatchListingPage from "./pages/WatchListingPage";
import EventsListingPage from "./pages/EventsListingPage";
import ProfilePage from "./pages/ProfilePage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LogoutPage from "./pages/LogoutPage";
import WatchlistPage from "./pages/WatchlistPage";
import CreatorProfilePage from "./pages/CreatorProfilePage";
import UserPlaylistsPage from "./pages/UserPlaylistsPage";
import MasterclassesListingPage from "./pages/MasterclassesListingPage";
import MasterclassDetailPage from "./pages/MasterclassDetailPage";
import MembershipPage from "./pages/MembershipPage";
import SubmitContentPage from "./pages/SubmitContentPage"; // New import
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem> {/* Add ThemeProvider here */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/shows" element={<ShowsListingPage />} />
              <Route path="/news" element={<NewsListingPage />} />
              <Route path="/music" element={<MusicPage />} />
              <Route path="/watch" element={<WatchListingPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/events" element={<EventsListingPage />} />
              <Route path="/masterclasses" element={<MasterclassesListingPage />} />
              <Route path="/masterclasses/:slug" element={<MasterclassDetailPage />} />
              <Route path="/membership" element={<MembershipPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/playlists" element={<UserPlaylistsPage />} />
              <Route path="/creators/:creatorId" element={<CreatorProfilePage />} />
              <Route path="/submit-content" element={<SubmitContentPage />} /> {/* New route */}
              <Route path="/music/shows/:id" element={<ContentDetailPage />} />
              <Route path="/sponsored/:id" element={<ContentDetailPage />} />
              <Route path="/:type/:id" element={<ContentDetailPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider> {/* Close ThemeProvider */}
  </QueryClientProvider>
);

export default App;