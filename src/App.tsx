import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import MyFeed from "./pages/MyFeed"; // New import
import SavedContent from "./pages/SavedContent"; // New import
import UserSettings from "./pages/UserSettings"; // New import
import Subscription from "./pages/Subscription"; // New import
import OfflineContent from "./pages/OfflineContent"; // New import
import Logout from "./pages/Logout"; // New import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-feed" element={<MyFeed />} /> {/* New route */}
          <Route path="/saved-content" element={<SavedContent />} /> {/* New route */}
          <Route path="/settings" element={<UserSettings />} /> {/* New route */}
          <Route path="/subscription" element={<Subscription />} /> {/* New route */}
          <Route path="/offline-content" element={<OfflineContent />} /> {/* New route */}
          <Route path="/logout" element={<Logout />} /> {/* New route */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;