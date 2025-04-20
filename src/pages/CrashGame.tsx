
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

export default function CrashGame() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userBalance, setUserBalance] = useState(5000); // Dummy balance
  const [betAmount, setBetAmount] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [crashPoint, setCrashPoint] = useState(0);
  const [hasExited, setHasExited] = useState(false);

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

  // Crash game logic
  useEffect(() => {
    if (!isPlaying) return;

    let multiplierInterval: NodeJS.Timeout;
    let incrementValue = 0.01;
    let timeStep = 50; // milliseconds

    // Generate crash point (between 1 and 10 with exponential distribution)
    const randomCrashPoint = 1 + Math.floor(-Math.log(Math.random()) * 2 * 100) / 100;
    setCrashPoint(parseFloat(randomCrashPoint.toFixed(2)));

    const startTime = Date.now();
    multiplierInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      // Exponential growth formula
      const newMultiplier = Math.exp(elapsedTime / 6000);
      setCurrentMultiplier(parseFloat(newMultiplier.toFixed(2)));

      // Check if crashed
      if (newMultiplier >= randomCrashPoint) {
        clearInterval(multiplierInterval);
        setIsPlaying(false);
        
        if (!hasExited) {
          toast.error(`Crashed at ${newMultiplier.toFixed(2)}x!`);
        }
      }
    }, timeStep);

    return () => clearInterval(multiplierInterval);
  }, [isPlaying, hasExited]);

  const startGame = () => {
    if (betAmount <= 0) {
      toast.error("Please enter a valid bet amount");
      return;
    }

    if (betAmount > userBalance) {
      toast.error("Insufficient balance");
      return;
    }

    setUserBalance(prev => prev - betAmount);
    setIsPlaying(true);
    setHasExited(false);
    setCurrentMultiplier(1);
  };

  const cashOut = () => {
    if (!isPlaying) return;

    const winAmount = betAmount * currentMultiplier;
    setUserBalance(prev => prev + winAmount);
    setHasExited(true);
    setIsPlaying(false);
    toast.success(`Cashed out at ${currentMultiplier.toFixed(2)}x! You won $${winAmount.toFixed(2)}`);
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Crash</h1>
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
                  <h2 className="text-xl font-bold text-white mb-2">Crash Game</h2>
                  <p className="text-gray-400">Cash out before the multiplier crashes!</p>
                </div>
                
                <div className="w-full h-64 bg-black rounded-lg flex items-center justify-center mb-6 relative overflow-hidden">
                  {isPlaying ? (
                    <div className="absolute inset-0 bg-green-500/20"></div>
                  ) : hasExited ? (
                    <div className="absolute inset-0 bg-green-500/20"></div>
                  ) : crashPoint > 0 ? (
                    <div className="absolute inset-0 bg-red-500/20"></div>
                  ) : null}
                  
                  <div className="text-6xl font-bold">
                    {isPlaying ? (
                      <span className="text-green-500 animate-pulse">{currentMultiplier.toFixed(2)}x</span>
                    ) : hasExited ? (
                      <span className="text-green-500">{currentMultiplier.toFixed(2)}x</span>
                    ) : crashPoint > 0 ? (
                      <span className="text-red-500">{crashPoint.toFixed(2)}x</span>
                    ) : (
                      <span className="text-white">Ready</span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  {!isPlaying ? (
                    <Button
                      className="bg-casino-primary hover:bg-casino-secondary px-8 py-4 text-xl"
                      onClick={startGame}
                      disabled={isPlaying}
                    >
                      Start Game
                    </Button>
                  ) : (
                    <Button
                      className="bg-green-600 hover:bg-green-700 px-8 py-4 text-xl"
                      onClick={cashOut}
                    >
                      Cash Out ({(betAmount * currentMultiplier).toFixed(2)})
                    </Button>
                  )}
                </div>
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
                      disabled={isPlaying}
                      className="w-full bg-casino-darker border border-casino-primary/30 rounded p-2 text-white"
                    />
                  </div>
                </div>
                
                <div className="p-3 bg-casino-darker rounded-md">
                  <p className="text-gray-400">Current Multiplier</p>
                  <p className="text-xl font-bold text-white">{currentMultiplier.toFixed(2)}x</p>
                </div>
                
                <div className="p-3 bg-casino-darker rounded-md">
                  <p className="text-gray-400">Potential Win</p>
                  <p className="text-xl font-bold text-white">
                    ${(betAmount * currentMultiplier).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="text-center text-xs text-gray-400 mt-6">
                <p>The longer you wait, the higher your multiplier!</p>
                <p>But be careful - if you wait too long, you'll lose everything!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
