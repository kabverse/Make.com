
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

interface UserData {
  id: string;
  email: string;
  name: string;
  balance: number;
}

export default function Games() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Check if user is authenticated
  useEffect(() => {
    const authUserString = localStorage.getItem("authUser");
    if (!authUserString) {
      navigate("/");
      return;
    }
    
    try {
      const user = JSON.parse(authUserString);
      setUserData(user);
    } catch (error) {
      console.error("Failed to parse user data", error);
      navigate("/");
    }
  }, [navigate]);

  // Making all games available now
  const games = [
    {
      id: "mines",
      name: "Mines",
      description: "Avoid the mines and collect gems for increasing multipliers.",
      emoji: "💣",
      maxWin: "1000x",
      popular: true,
      available: true,
    },
    {
      id: "roulette",
      name: "Roulette",
      description: "The classic casino game with American and European variants.",
      emoji: "🎯",
      maxWin: "36x",
      popular: true,
      available: true, // Now available
    },
    {
      id: "hilo",
      name: "Hi-Lo",
      description: "Predict if the next card will be higher or lower.",
      emoji: "🃏",
      maxWin: "10x",
      popular: false,
      available: true, // Now available
    },
    {
      id: "tower",
      name: "Dragon Tower",
      description: "Climb the dragon tower and collect bigger prizes.",
      emoji: "🐉",
      maxWin: "100x",
      popular: true,
      available: true, // Now available
    },
    {
      id: "dice",
      name: "Dice",
      description: "Roll the dice and win based on your prediction.",
      emoji: "🎲",
      maxWin: "100x",
      popular: false,
      available: true, // Now available
    },
    {
      id: "crash",
      name: "Crash",
      description: "Cash out before the multiplier crashes to win.",
      emoji: "📈",
      maxWin: "Unlimited",
      popular: true,
      available: true, // Now available
    },
    {
      id: "slots",
      name: "Slots",
      description: "Classic slot machines with various themes.",
      emoji: "🎰",
      maxWin: "1000x",
      popular: true,
      available: true, // Now available
    },
    {
      id: "plinko",
      name: "Plinko",
      description: "Drop the ball and watch it bounce for random prizes.",
      emoji: "📍",
      maxWin: "300x",
      popular: false,
      available: true, // Now available
    },
    {
      id: "blackjack",
      name: "Blackjack",
      description: "Beat the dealer by getting closer to 21.",
      emoji: "♠️",
      maxWin: "2.5x",
      popular: false,
      available: true, // Now available
    },
    {
      id: "baccarat",
      name: "Baccarat",
      description: "Bet on the banker, player, or tie.",
      emoji: "🎴",
      maxWin: "9x",
      popular: false,
      available: true, // Now available
    },
  ];

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="pt-20 flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-casino-darker to-casino-dark py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              Welcome, {userData.name}
            </h1>
            <p className="mt-4 text-gray-300 text-center max-w-3xl mx-auto">
              Explore our wide range of exciting games with amazing rewards and stunning visuals.
            </p>
          </div>
        </div>
        
        {/* Popular Games */}
        <div className="bg-casino-dark py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">
              Popular Games
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {games
                .filter(game => game.popular)
                .map(game => (
                  <Link 
                    key={game.id} 
                    to={game.available ? `/games/${game.id}` : "#"} 
                    className={`game-card group ${!game.available ? "pointer-events-none opacity-70" : ""}`}
                    onClick={(e) => {
                      if (!game.available) {
                        e.preventDefault();
                        toast.info("Coming soon! This game is under development.");
                      }
                    }}
                  >
                    <div className="aspect-square relative overflow-hidden rounded-xl">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                      <div className="absolute bottom-0 left-0 p-4 z-20">
                        <h3 className="text-xl font-semibold text-white">{game.name}</h3>
                        <p className="text-gray-300 text-sm">Max win: {game.maxWin}</p>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <Button className="btn-casino">
                          {game.available ? "Play Now" : "Coming Soon"}
                        </Button>
                      </div>
                      <div className="h-full w-full bg-casino-primary/20 flex items-center justify-center">
                        <div className="text-5xl">{game.emoji}</div>
                      </div>
                      {!game.available && (
                        <div className="absolute top-2 right-2 bg-casino-highlight px-2 py-1 rounded text-xs font-medium z-30">
                          Coming Soon
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
        
        {/* All Games */}
        <div className="bg-casino-darker py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">
              All Games
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {games.map(game => (
                <Link 
                  key={game.id} 
                  to={game.available ? `/games/${game.id}` : "#"} 
                  className={`bg-casino-dark border border-casino-primary/30 rounded-lg p-4 hover:border-casino-primary/70 transition-all duration-300 ${!game.available ? "pointer-events-none opacity-70" : ""}`}
                  onClick={(e) => {
                    if (!game.available) {
                      e.preventDefault();
                      toast.info("Coming soon! This game is under development.");
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{game.emoji}</div>
                    <div>
                      <h3 className="text-white font-medium">{game.name}</h3>
                      <p className="text-gray-400 text-xs">Max: {game.maxWin}</p>
                    </div>
                    {!game.available && (
                      <div className="ml-auto bg-casino-highlight/50 px-1.5 py-0.5 rounded text-[10px] font-medium">
                        Soon
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-gray-400 text-sm">{game.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
