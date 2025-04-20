
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface UserData {
  id: string;
  email: string;
  name: string;
  balance: number;
}

interface Symbol {
  id: number;
  emoji: string;
  name: string;
  multiplier: number;
}

export default function SlotsGame() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userBalance, setUserBalance] = useState(5000); // Dummy balance
  const [betAmount, setBetAmount] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState<Symbol[][]>([[], [], []]);
  
  // Define symbols
  const symbols: Symbol[] = [
    { id: 1, emoji: "🍒", name: "Cherry", multiplier: 2 },
    { id: 2, emoji: "🍋", name: "Lemon", multiplier: 3 },
    { id: 3, emoji: "🍊", name: "Orange", multiplier: 4 },
    { id: 4, emoji: "🍇", name: "Grapes", multiplier: 5 },
    { id: 5, emoji: "🍉", name: "Watermelon", multiplier: 6 },
    { id: 6, emoji: "🔔", name: "Bell", multiplier: 8 },
    { id: 7, emoji: "💎", name: "Diamond", multiplier: 10 },
    { id: 8, emoji: "7️⃣", name: "Seven", multiplier: 20 },
  ];

  // Initialize reels
  useEffect(() => {
    initializeReels();
  }, []);

  // Load user data
  useEffect(() => {
    const authUserString = localStorage.getItem("authUser");
    if (authUserString) {
      try {
        const user = JSON.parse(authUserString);
        setUserData(user);
      } catch (error) {
        console.error("Failed to parse user data", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const initializeReels = () => {
    const initialReels = Array(3).fill(0).map(() => 
      Array(3).fill(0).map(() => getRandomSymbol())
    );
    setReels(initialReels);
  };

  const getRandomSymbol = (): Symbol => {
    return symbols[Math.floor(Math.random() * symbols.length)];
  };

  const spinReels = () => {
    if (betAmount <= 0) {
      toast.error("Please enter a valid bet amount");
      return;
    }

    if (betAmount > userBalance) {
      toast.error("Insufficient balance");
      return;
    }

    setUserBalance(prev => prev - betAmount);
    setIsSpinning(true);
    
    let spinCount = 0;
    const maxSpins = 20;
    const spinInterval = setInterval(() => {
      // Update reels randomly
      setReels(current => 
        current.map(reel => reel.map(() => getRandomSymbol()))
      );
      
      spinCount++;
      
      if (spinCount >= maxSpins) {
        clearInterval(spinInterval);
        const finalReels = Array(3).fill(0).map(() => 
          Array(3).fill(0).map(() => getRandomSymbol())
        );
        setReels(finalReels);
        checkWin(finalReels);
        setIsSpinning(false);
      }
    }, 100);
  };

  const checkWin = (currentReels: Symbol[][]) => {
    let totalWin = 0;
    
    // Check horizontal lines
    for (let i = 0; i < 3; i++) {
      const row = [currentReels[0][i], currentReels[1][i], currentReels[2][i]];
      
      // Check for 3 of a kind
      if (row[0].id === row[1].id && row[1].id === row[2].id) {
        const winAmount = betAmount * row[0].multiplier * 3;
        totalWin += winAmount;
      }
      // Check for 2 of a kind
      else if (row[0].id === row[1].id || row[1].id === row[2].id || row[0].id === row[2].id) {
        const symbolMultiplier = row[0].id === row[1].id ? row[0].multiplier : 
                                row[1].id === row[2].id ? row[1].multiplier : row[0].multiplier;
        const winAmount = betAmount * symbolMultiplier;
        totalWin += winAmount;
      }
    }
    
    if (totalWin > 0) {
      setUserBalance(prev => prev + totalWin);
      toast.success(`You won $${totalWin.toFixed(2)}!`);
    } else {
      toast.error("No winning combinations. Better luck next time!");
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="pt-20 flex-grow bg-casino-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Slots</h1>
            <Button 
              variant="outline" 
              className="border-casino-primary/30 text-white"
              onClick={() => navigate("/games")}
            >
              Back to Games
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-casino-dark rounded-xl p-6 border border-casino-primary/20">
              <div className="flex flex-col items-center">
                <div className="mb-8 text-center">
                  <h2 className="text-xl font-bold text-white mb-2">Fruit Slots</h2>
                  <p className="text-gray-400">Match symbols to win prizes!</p>
                </div>
                
                <div className="bg-black p-6 rounded-lg border-4 border-yellow-600 mb-8">
                  <div className="grid grid-cols-3 gap-4">
                    {reels.map((reel, reelIndex) => (
                      <div key={reelIndex} className="flex flex-col">
                        {reel.map((symbol, symbolIndex) => (
                          <div 
                            key={`${reelIndex}-${symbolIndex}`}
                            className={`text-5xl h-20 w-20 flex items-center justify-center bg-casino-darker border border-yellow-600/30 ${
                              symbolIndex === 1 ? "ring-2 ring-yellow-400" : ""
                            }`}
                          >
                            {symbol.emoji}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button
                  className="bg-yellow-600 hover:bg-yellow-700 px-12 py-4 text-xl"
                  onClick={spinReels}
                  disabled={isSpinning}
                >
                  {isSpinning ? "Spinning..." : "Spin"}
                </Button>
              </div>
            </div>
            
            <div className="bg-casino-dark rounded-xl p-6 border border-casino-primary/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-semibold">Your Balance</h3>
                <p className="text-xl font-bold text-white">${userBalance.toFixed(2)}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white font-medium mb-2 block">Bet Amount</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                      min={1}
                      disabled={isSpinning}
                      className="w-full bg-casino-darker border border-casino-primary/30 rounded p-2 text-white"
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-casino-darker rounded-md">
                  <h4 className="text-white font-semibold mb-2">Paytable</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {symbols.map(symbol => (
                      <div key={symbol.id} className="flex items-center space-x-2">
                        <span className="text-2xl">{symbol.emoji}</span>
                        <span className="text-white">{symbol.multiplier}x</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="text-center text-xs text-gray-400 mt-6">
                <p>3 matching symbols on a line pays 3x the symbol value</p>
                <p>2 matching symbols pays 1x the symbol value</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
