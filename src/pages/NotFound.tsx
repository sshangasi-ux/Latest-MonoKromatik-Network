import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-5xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-300 mb-4">Oops! Page not found</p>
          <a href="/" className="text-red-500 hover:text-red-400 underline">
            Return to Home
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;