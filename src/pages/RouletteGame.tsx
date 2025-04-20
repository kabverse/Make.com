
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

export default function RouletteGame() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [betAmount, setBetAmount] = useState(1);
  const [userBalance, setUserBalance] = useState(5000); // Dummy balance
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

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

  const handleSpin = () => {
    if (selectedNumber === null) {
      toast.error("Please select a number");
      return;
    }

    if (betAmount <= 0) {
      toast.error("Please enter a valid bet amount");
      return;
    }

    if (betAmount > userBalance) {
      toast.error("Insufficient balance");
      return;
    }

    setIsSpinning(true);
    
    // Simulate spinning
    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 37); // 0-36
      setResult(randomNumber);
      
      if (randomNumber === selectedNumber) {
        const winAmount = betAmount * 36;
        setUserBalance(prev => prev + winAmount);
        toast.success(`You won $${winAmount}!`);
      } else {
        setUserBalance(prev => prev - betAmount);
        toast.error(`You lost! The ball landed on ${randomNumber}`);
      }
      
      setIsSpinning(false);
    }, 2000);
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Roulette</h1>
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
                  <h2 className="text-xl font-bold text-white mb-2">European Roulette</h2>
                  <p className="text-gray-400">Place your bets and spin the wheel!</p>
                </div>
                
                <div className="w-64 h-64 rounded-full bg-casino-primary/30 border-4 border-casino-primary flex items-center justify-center mb-6">
                  {isSpinning ? (
                    <span className="text-3xl animate-spin">🎯</span>
                  ) : (
                    <span className="text-4xl">{result !== null ? result : "?"}</span>
                  )}
                </div>
                
                <div className="grid grid-cols-6 gap-2 mt-4 max-w-md">
                  {[...Array(37)].map((_, i) => (
                    <button
                      key={i}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedNumber === i 
                          ? "bg-casino-primary text-white" 
                          : i === 0 
                            ? "bg-green-700 text-white" 
                            : (i % 2 === 0) 
                              ? "bg-black text-white" 
                              : "bg-red-700 text-white"
                      }`}
                      onClick={() => setSelectedNumber(i)}
                    >
                      {i}
                    </button>
                  ))}
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
                      className="w-full bg-casino-darker border border-casino-primary/30 rounded p-2 text-white"
                    />
                  </div>
                </div>
                
                {selectedNumber !== null && (
                  <div className="p-3 bg-casino-darker rounded-md">
                    <p className="text-gray-400">Selected Number</p>
                    <p className="text-xl font-bold text-white">{selectedNumber}</p>
                  </div>
                )}
                
                <div className="p-3 bg-casino-darker rounded-md">
                  <p className="text-gray-400">Potential Win</p>
                  <p className="text-xl font-bold text-white">
                    ${(betAmount * 36).toFixed(2)}
                  </p>
                </div>
                
                <Button 
                  className="w-full bg-casino-primary hover:bg-casino-secondary"
                  onClick={handleSpin}
                  disabled={isSpinning || selectedNumber === null}
                >
                  {isSpinning ? "Spinning..." : "Spin Wheel"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
