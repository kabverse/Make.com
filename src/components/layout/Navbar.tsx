
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Wallet, LogIn } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LoginForm from "../auth/LoginForm";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Mocked login function for demonstration
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setBalance(1000); // Demo balance
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-casino-darker/90 backdrop-blur-sm border-b border-casino-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-primary text-transparent bg-clip-text">
                MAKE.COM
              </span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-6">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/games" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                Games
              </Link>
              <Link to="/promotions" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                Promotions
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 bg-casino-dark px-4 py-2 rounded-md border border-casino-primary/30">
                  <Wallet className="h-4 w-4 text-casino-primary" />
                  <span className="text-white font-medium">${balance.toFixed(2)}</span>
                </div>
                <Button 
                  className="bg-casino-primary hover:bg-casino-secondary text-white"
                  onClick={() => setIsLoggedIn(false)}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-casino-primary hover:bg-casino-secondary text-white">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-casino-dark border-casino-primary/50">
                  <LoginForm onSuccess={handleLoginSuccess} />
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-casino-dark"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-casino-dark">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/games" 
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Games
            </Link>
            <Link 
              to="/promotions" 
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Promotions
            </Link>
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 bg-casino-darker px-4 py-2 rounded-md">
                  <Wallet className="h-4 w-4 text-casino-primary" />
                  <span className="text-white font-medium">${balance.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full bg-casino-primary hover:bg-casino-secondary text-white mt-2"
                  onClick={() => {
                    setIsLoggedIn(false);
                    closeMenu();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full bg-casino-primary hover:bg-casino-secondary text-white mt-2"
                    onClick={closeMenu}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-casino-dark border-casino-primary/50">
                  <LoginForm onSuccess={handleLoginSuccess} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
