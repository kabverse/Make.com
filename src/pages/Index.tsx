
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Zap, Award, DollarSign } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoginForm from "@/components/auth/LoginForm";

// Demo game images
const gameImages = {
  mines: "/images/mines.jpg",
  roulette: "/images/roulette.jpg",
  hilo: "/images/hilo.jpg",
  tower: "/images/tower.jpg",
};

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-16 bg-gradient-to-b from-casino-darker to-casino-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              <span className="bg-gradient-primary text-transparent bg-clip-text">
                Play, Win, Repeat.
              </span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-300">
              Experience the thrill of fair gaming with instant payouts and amazing bonuses.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="btn-casino text-lg px-8 py-3">
                    Get Started
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-casino-dark border-casino-primary/50">
                  <LoginForm />
                </DialogContent>
              </Dialog>
              <Link to="/games">
                <Button className="btn-accent text-lg px-8 py-3">
                  Play Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-casino-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-16">
            Why Choose <span className="bg-gradient-primary text-transparent bg-clip-text">MAKE.COM</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-casino-darker p-6 rounded-lg border border-casino-primary/20 hover:border-casino-primary/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-casino-primary/20 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-casino-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Fair</h3>
              <p className="text-gray-400">Provably fair games with transparent mechanics and secure payment processing.</p>
            </div>
            
            <div className="bg-casino-darker p-6 rounded-lg border border-casino-primary/20 hover:border-casino-primary/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-casino-primary/20 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-casino-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Instant Payouts</h3>
              <p className="text-gray-400">Withdraw your winnings instantly with no processing delays.</p>
            </div>
            
            <div className="bg-casino-darker p-6 rounded-lg border border-casino-primary/20 hover:border-casino-primary/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-casino-primary/20 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-casino-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Exclusive Bonuses</h3>
              <p className="text-gray-400">Get rewarded with generous bonuses and regular promotions.</p>
            </div>
            
            <div className="bg-casino-darker p-6 rounded-lg border border-casino-primary/20 hover:border-casino-primary/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-casino-primary/20 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-casino-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Low House Edge</h3>
              <p className="text-gray-400">Enjoy games with the lowest house edge in the industry for better chances to win.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Games Preview */}
      <div className="bg-casino-darker py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Popular Games
          </h2>
          <p className="text-gray-400 text-center max-w-3xl mx-auto mb-16">
            Try our selection of exciting casino games with amazing graphics and immersive gameplay.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/games/mines" className="game-card group">
              <div className="aspect-square relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <div className="absolute bottom-0 left-0 p-4 z-20">
                  <h3 className="text-xl font-semibold text-white">Mines</h3>
                  <p className="text-gray-300 text-sm">Up to 1000x multiplier</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <Button className="btn-casino">Play Now</Button>
                </div>
                <div className="h-full w-full bg-casino-primary/20 flex items-center justify-center">
                  <div className="text-5xl">💣</div>
                </div>
              </div>
            </Link>
            
            <Link to="/games/roulette" className="game-card group">
              <div className="aspect-square relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <div className="absolute bottom-0 left-0 p-4 z-20">
                  <h3 className="text-xl font-semibold text-white">Roulette</h3>
                  <p className="text-gray-300 text-sm">Classic casino experience</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <Button className="btn-casino">Play Now</Button>
                </div>
                <div className="h-full w-full bg-casino-primary/20 flex items-center justify-center">
                  <div className="text-5xl">🎯</div>
                </div>
              </div>
            </Link>
            
            <Link to="/games/hilo" className="game-card group">
              <div className="aspect-square relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <div className="absolute bottom-0 left-0 p-4 z-20">
                  <h3 className="text-xl font-semibold text-white">Hi-Lo</h3>
                  <p className="text-gray-300 text-sm">Simple but exciting</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <Button className="btn-casino">Play Now</Button>
                </div>
                <div className="h-full w-full bg-casino-primary/20 flex items-center justify-center">
                  <div className="text-5xl">🃏</div>
                </div>
              </div>
            </Link>
            
            <Link to="/games/tower" className="game-card group">
              <div className="aspect-square relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <div className="absolute bottom-0 left-0 p-4 z-20">
                  <h3 className="text-xl font-semibold text-white">Dragon Tower</h3>
                  <p className="text-gray-300 text-sm">Climb higher for better rewards</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <Button className="btn-casino">Play Now</Button>
                </div>
                <div className="h-full w-full bg-casino-primary/20 flex items-center justify-center">
                  <div className="text-5xl">🐉</div>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="flex justify-center mt-12">
            <Link to="/games">
              <Button className="btn-casino">View All Games</Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="bg-casino-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-16">
            What Our Players Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-casino-darker p-6 rounded-lg border border-casino-primary/20">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-casino-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold text-casino-primary">J</span>
                </div>
                <div>
                  <p className="font-medium text-white">John D.</p>
                  <p className="text-gray-400 text-sm">VIP Player</p>
                </div>
              </div>
              <p className="text-gray-300">
                "The games are fantastic and the payouts are lightning fast. I've been playing for months and never had any issues."
              </p>
            </div>
            
            <div className="bg-casino-darker p-6 rounded-lg border border-casino-primary/20">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-casino-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold text-casino-primary">S</span>
                </div>
                <div>
                  <p className="font-medium text-white">Sarah M.</p>
                  <p className="text-gray-400 text-sm">Regular Player</p>
                </div>
              </div>
              <p className="text-gray-300">
                "I love the bonus system! Every week there's something new and exciting to keep me coming back."
              </p>
            </div>
            
            <div className="bg-casino-darker p-6 rounded-lg border border-casino-primary/20">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-casino-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold text-casino-primary">R</span>
                </div>
                <div>
                  <p className="font-medium text-white">Robert K.</p>
                  <p className="text-gray-400 text-sm">New Player</p>
                </div>
              </div>
              <p className="text-gray-300">
                "The customer service is incredible. They helped me when I had an issue, and it was resolved in minutes!"
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="bg-gradient-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to start playing?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Join thousands of players and experience the best online gambling platform. Sign up today and get a welcome bonus!
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-white text-casino-primary hover:bg-gray-100 font-medium text-lg px-8 py-3">
                Join Now
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-casino-dark border-casino-primary/50">
              <LoginForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
