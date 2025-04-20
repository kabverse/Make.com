
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-casino-darker border-t border-casino-primary/20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="text-xl font-bold bg-gradient-primary text-transparent bg-clip-text mb-4">
              MAKE.COM
            </h3>
            <p className="text-gray-400 text-sm">
              The ultimate destination for online gambling with fair play and instant payouts.
            </p>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-4">Games</h4>
            <ul className="space-y-2">
              <li><Link to="/games/mines" className="text-gray-400 hover:text-white text-sm">Mines</Link></li>
              <li><Link to="/games/roulette" className="text-gray-400 hover:text-white text-sm">Roulette</Link></li>
              <li><Link to="/games/hilo" className="text-gray-400 hover:text-white text-sm">Hi-Lo</Link></li>
              <li><Link to="/games/tower" className="text-gray-400 hover:text-white text-sm">Dragon Tower</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-gray-400 hover:text-white text-sm">Login</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white text-sm">Register</Link></li>
              <li><Link to="/wallet" className="text-gray-400 hover:text-white text-sm">Wallet</Link></li>
              <li><Link to="/profile" className="text-gray-400 hover:text-white text-sm">Profile</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-400 hover:text-white text-sm">FAQ</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-casino-primary/10">
          <p className="text-gray-500 text-center text-sm">
            &copy; {new Date().getFullYear()} MAKE.COM. All rights reserved. For entertainment purposes only. 18+
          </p>
          <p className="text-gray-600 text-center text-xs mt-2">
            Gamble responsibly. Play for fun, not to make money.
          </p>
        </div>
      </div>
    </footer>
  );
}
