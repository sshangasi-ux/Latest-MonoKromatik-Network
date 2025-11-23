import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-4xl font-heading font-bold mb-4 uppercase tracking-tight">404</h1>
        <p className="text-xl text-muted-foreground mb-4 font-sans">Oops! Page not found</p>
        <a href="/" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;