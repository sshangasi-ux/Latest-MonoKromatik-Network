import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";
import ContentDetailPage from "./pages/ContentDetailPage"; // Ensure ContentDetailPage is imported
import MusicPage from "./pages/MusicPage"; // Import MusicPage
import ShopPage from "./pages/ShopPage"; // Import ShopPage
import ShowsListingPage from "./pages/ShowsListingPage"; // Import ShowsListingPage
import NewsListingPage from "./pages/NewsListingPage"; // Import NewsListingPage
import WatchListingPage from "./pages/WatchListingPage"; // Import WatchListingPage
import EventsListingPage from "./pages/EventsListingPage"; // Import EventsListingPage
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
            <Route path="/shows" element={<ShowsListingPage />} /> {/* New Shows Listing Route */}
            <Route path="/news" element={<NewsListingPage />} /> {/* New News Listing Route */}
            <Route path="/music" element={<MusicPage />} /> {/* New Music Route */}
            <Route path="/watch" element={<WatchListingPage />} /> {/* New Watch Listing Route */}
            <Route path="/shop" element={<ShopPage />} /> {/* New Shop Route */}
            <Route path="/events" element={<EventsListingPage />} /> {/* New Events Listing Route */}
            <Route path="/:type/:id" element={<ContentDetailPage />} /> {/* Dynamic Content Detail Route */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;