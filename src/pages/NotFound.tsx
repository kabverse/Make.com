
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-casino-darker">
        <div className="text-center px-4">
          <h1 className="text-9xl font-bold bg-gradient-primary text-transparent bg-clip-text">404</h1>
          <p className="text-2xl text-white mt-4 mb-8">Oops! This page doesn't exist</p>
          <Link to="/">
            <Button className="btn-casino">Return to Home</Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
