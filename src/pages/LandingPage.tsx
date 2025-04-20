
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-casino-darker overflow-hidden relative">
      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center fixed top-0 z-50 bg-casino-darker/90 backdrop-blur-sm">
        <div className="text-2xl font-bold bg-gradient-primary text-transparent bg-clip-text">
          MAKE.COM
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-casino-primary hover:bg-casino-secondary text-white font-medium">
                Login
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-casino-dark border-casino-primary/50">
              <LoginForm onSuccess={() => navigate("/games")} />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-casino-highlight hover:bg-casino-highlight/90 text-white font-medium">
                Sign Up
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-casino-dark border-casino-primary/50">
              <SignupForm onSuccess={() => navigate("/games")} />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`pt-32 pb-20 px-4 flex flex-col items-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-4xl md:text-6xl font-bold text-center bg-gradient-primary text-transparent bg-clip-text mb-6">
          Ultimate Casino Experience
        </h1>
        <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-10">
          Dive into the exciting world of online gaming with unbeatable odds and instant payouts.
          Join thousands of players winning big every day!
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="px-8 py-6 text-xl bg-casino-highlight hover:bg-casino-highlight/90 text-white font-medium rounded-md animate-pulse transition-all hover:animate-none">
              Play Now
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-casino-dark border-casino-primary/50">
            <SignupForm onSuccess={() => navigate("/games")} />
          </DialogContent>
        </Dialog>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-casino-dark">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Why Choose <span className="bg-gradient-primary text-transparent bg-clip-text">MAKE.COM</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className={`feature-card p-6 rounded-xl bg-casino-darker border border-casino-primary/20 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🎮</span>
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-2">Exciting Games</h3>
              <p className="text-gray-400 text-center">
                Multiple thrilling games for every type of player. Try your luck and win big!
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className={`feature-card p-6 rounded-xl bg-casino-darker border border-casino-primary/20 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-2">Instant Payouts</h3>
              <p className="text-gray-400 text-center">
                Request withdrawals anytime and receive your winnings almost instantly.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className={`feature-card p-6 rounded-xl bg-casino-darker border border-casino-primary/20 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-2">Secure Platform</h3>
              <p className="text-gray-400 text-center">
                Your data and transactions are protected with the highest security standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Game Preview Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Our Popular Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Game 1 */}
            <div className={`game-card overflow-hidden transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`} style={{ transitionDelay: '300ms' }}>
              <div className="aspect-w-16 aspect-h-9 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-purple-900/90 flex items-center justify-center">
                  <div className="text-5xl">💣</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-1">Mines</h3>
                <p className="text-gray-400 text-sm mb-4">Avoid the mines, collect gems and cash out big!</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-casino-primary hover:bg-casino-secondary">
                      Play Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-casino-dark border-casino-primary/50">
                    <LoginForm onSuccess={() => navigate("/games/mines")} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {/* Game 2 */}
            <div className={`game-card overflow-hidden transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`} style={{ transitionDelay: '400ms' }}>
              <div className="aspect-w-16 aspect-h-9 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-purple-900/90 flex items-center justify-center">
                  <div className="text-5xl">🐉</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-1">Dragon Tower</h3>
                <p className="text-gray-400 text-sm mb-4">Climb the tower for increasing multipliers!</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-casino-primary hover:bg-casino-secondary">
                      Play Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-casino-dark border-casino-primary/50">
                    <LoginForm onSuccess={() => navigate("/games")} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {/* Game 3 */}
            <div className={`game-card overflow-hidden transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`} style={{ transitionDelay: '500ms' }}>
              <div className="aspect-w-16 aspect-h-9 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-purple-900/90 flex items-center justify-center">
                  <div className="text-5xl">🎲</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-1">Roulette</h3>
                <p className="text-gray-400 text-sm mb-4">Classic casino game with exciting odds!</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-casino-primary hover:bg-casino-secondary">
                      Play Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-casino-dark border-casino-primary/50">
                    <LoginForm onSuccess={() => navigate("/games")} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-casino-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Winning?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of players who trust MAKE.COM for their gaming experience.
            Get started today and claim your welcome bonus!
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="px-8 py-3 text-xl bg-casino-highlight hover:bg-casino-highlight/90 text-white font-bold rounded-md">
                Create Account
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-casino-dark border-casino-primary/50">
              <SignupForm onSuccess={() => navigate("/games")} />
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <Footer />

      {/* Floating elements for aesthetic */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-700/20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-700/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
}
