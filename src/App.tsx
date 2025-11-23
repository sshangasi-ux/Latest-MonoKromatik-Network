import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ProfilePage from "./pages/ProfilePage"; // Import ProfilePage
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            <Route path="/profile" element={<ProfilePage />} /> {/* New Profile Route */}
            <Route path="/:type/:id" element={<ContentDetailPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;