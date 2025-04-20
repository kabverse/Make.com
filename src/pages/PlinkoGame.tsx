import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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

export default function PlinkoGame() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userBalance, setUserBalance] = useState(5000); // Dummy balance
  const [betAmount, setBetAmount] = useState(1);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isDropping, setIsDropping] = useState(false);
  const [ballPosition, setBallPosition] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState(0);

  // Multiplier arrays for different risk levels
  const multipliers = {
    low: [1.2, 1.5, 2, 3, 5, 3, 2, 1.5, 1.2],
    medium: [1.1, 1.3, 1.5, 2, 5, 10, 5, 2, 1.5, 1.3, 1.1],
    high: [1, 1.1, 1.3, 1.6, 2, 8, 15, 8, 2, 1.6, 1.3, 1]
  };

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

  const dropBall = () => {
    if (betAmount <= 0) {
      toast.error("Please enter a valid bet amount");
      return;
    }

    if (betAmount > userBalance) {
      toast.error("Insufficient balance");
      return;
    }

    setUserBalance(prev => prev - betAmount);
    setIsDropping(true);
    setBallPosition(Math.floor(multipliers[riskLevel].length / 2)); // Start from middle
    
    // Simulate ball dropping
    let row = 0;
    const totalRows = 8;
    const rowInterval = setInterval(() => {
      setBallPosition(prev => {
        if (prev === null) return null;
        
        // 50% chance to go left or right
        const direction = Math.random() > 0.5 ? 1 : -1;
        const newPosition = prev + direction;
        
        // Keep within bounds
        const maxIdx = multipliers[riskLevel].length - 1;
        return Math.max(0, Math.min(maxIdx, newPosition));
      });
      
      row++;
      
      if (row >= totalRows) {
        clearInterval(rowInterval);
        finishDrop();
      }
    }, 300);
  };

  const finishDrop = () => {
    if (ballPosition === null) return;
    
    const finalMultiplier = multipliers[riskLevel][ballPosition];
    setMultiplier(finalMultiplier);
    
    const winAmount = betAmount * finalMultiplier;
    setUserBalance(prev => prev + winAmount);
    
    toast.success(`You won $${winAmount.toFixed(2)}!`);
    setIsDropping(false);
  };

  const getCurrentMultipliers = () => {
    return multipliers[riskLevel];
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Plinko</h1>
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
                  <h2 className="text-xl font-bold text-white mb-2">Plinko</h2>
                  <p className="text-gray-400">Drop the ball and win prizes!</p>
                </div>
                
                <div className="bg-black w-full max-w-md rounded-lg p-4 mb-6">
                  {/* Plinko board */}
                  <div className="grid grid-rows-8 gap-4 mb-4">
                    {/* Top drop point */}
                    <div className="flex justify-center">
                      <div className={`w-4 h-4 rounded-full ${isDropping ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
                    </div>
                    
                    {/* Pins (just decorative) */}
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="flex justify-around">
                        {[...Array(i + 2)].map((_, j) => (
                          <div key={j} className="w-2 h-2 rounded-full bg-gray-600"></div>
                        ))}
                      </div>
                    ))}
                  </div>
                  
                  {/* Multiplier slots at bottom */}
                  <div className="grid grid-cols-11 gap-1">
                    {getCurrentMultipliers().map((mult, i) => (
                      <div 
                        key={i} 
                        className={`text-center py-2 rounded ${
                          ballPosition === i && !isDropping 
                            ? 'bg-yellow-600 text-white' 
                            : 'bg-casino-primary/20 text-gray-300'
                        } ${
                          mult >= 5 ? 'text-green-400' : mult >= 2 ? 'text-blue-400' : 'text-gray-400'
                        }`}
                      >
                        {mult}x
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button
                  className="bg-casino-primary hover:bg-casino-secondary px-8 py-4 text-xl mb-6"
                  onClick={dropBall}
                  disabled={isDropping}
                >
                  {isDropping ? "Dropping..." : "Drop Ball"}
                </Button>
                
                <div className="w-full max-w-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-white">Risk Level</span>
                    <span className="text-white capitalize">{riskLevel}</span>
                  </div>
                  
                  <div className="flex justify-between mb-4">
                    <Button 
                      variant={riskLevel === 'low' ? 'default' : 'outline'}
                      className={riskLevel === 'low' ? 'bg-casino-primary' : 'border-casino-primary/30 text-white'}
                      onClick={() => setRiskLevel('low')}
                      disabled={isDropping}
                    >
                      Low
                    </Button>
                    <Button 
                      variant={riskLevel === 'medium' ? 'default' : 'outline'}
                      className={riskLevel === 'medium' ? 'bg-casino-primary' : 'border-casino-primary/30 text-white'}
                      onClick={() => setRiskLevel('medium')}
                      disabled={isDropping}
                    >
                      Medium
                    </Button>
                    <Button 
                      variant={riskLevel === 'high' ? 'default' : 'outline'}
                      className={riskLevel === 'high' ? 'bg-casino-primary' : 'border-casino-primary/30 text-white'}
                      onClick={() => setRiskLevel('high')}
                      disabled={isDropping}
                    >
                      High
                    </Button>
                  </div>
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
                      disabled={isDropping}
                      className="w-full bg-casino-darker border border-casino-primary/30 rounded p-2 text-white"
                    />
                  </div>
                </div>
                
                {multiplier > 0 && !isDropping && (
                  <div className="p-3 bg-casino-darker rounded-md">
                    <p className="text-gray-400">Last Multiplier</p>
                    <p className="text-xl font-bold text-white">{multiplier}x</p>
                  </div>
                )}
                
                <div className="p-3 bg-casino-darker rounded-md">
                  <p className="text-gray-400">Max Potential Win</p>
                  <p className="text-xl font-bold text-white">
                    ${(betAmount * Math.max(...getCurrentMultipliers())).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="text-center text-xs text-gray-400 mt-6">
                <p>Higher risk = higher potential rewards!</p>
                <p>The ball bounces randomly as it falls.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
