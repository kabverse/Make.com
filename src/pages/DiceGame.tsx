
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

export default function DiceGame() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userBalance, setUserBalance] = useState(5000); // Dummy balance
  const [betAmount, setBetAmount] = useState(1);
  const [target, setTarget] = useState(50);
  const [isRolling, setIsRolling] = useState(false);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [betType, setBetType] = useState<'over' | 'under'>('over');
  const [multiplier, setMultiplier] = useState(2);

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

  // Calculate multiplier based on target
  useEffect(() => {
    // Formula: 99 / (betType === 'over' ? 100 - target : target)
    let calculatedMultiplier = 0;
    if (betType === 'over') {
      calculatedMultiplier = 99 / (100 - target);
    } else {
      calculatedMultiplier = 99 / target;
    }
    
    // Round to 2 decimal places
    setMultiplier(parseFloat(calculatedMultiplier.toFixed(2)));
  }, [target, betType]);

  const handleRoll = () => {
    if (betAmount <= 0) {
      toast.error("Please enter a valid bet amount");
      return;
    }

    if (betAmount > userBalance) {
      toast.error("Insufficient balance");
      return;
    }
    
    setUserBalance(prev => prev - betAmount);
    setIsRolling(true);
    
    // Simulate rolling animation
    let rollCount = 0;
    const maxRolls = 20;
    const rollInterval = setInterval(() => {
      setRollResult(Math.floor(Math.random() * 100) + 1);
      rollCount++;
      
      if (rollCount >= maxRolls) {
        clearInterval(rollInterval);
        const finalResult = Math.floor(Math.random() * 100) + 1;
        setRollResult(finalResult);
        
        // Check win condition
        let isWin = false;
        if (betType === 'over' && finalResult > target) {
          isWin = true;
        } else if (betType === 'under' && finalResult < target) {
          isWin = true;
        }
        
        if (isWin) {
          const winAmount = betAmount * multiplier;
          setUserBalance(prev => prev + winAmount);
          toast.success(`You won $${winAmount.toFixed(2)}!`);
        } else {
          toast.error(`You lost! Roll: ${finalResult}, Target: ${betType === 'over' ? '>' : '<'} ${target}`);
        }
        
        setIsRolling(false);
      }
    }, 50);
  };

  const toggleBetType = () => {
    setBetType(prev => prev === 'over' ? 'under' : 'over');
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Dice</h1>
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
                  <h2 className="text-xl font-bold text-white mb-2">Dice Roll</h2>
                  <p className="text-gray-400">
                    Roll {betType === 'over' ? 'over' : 'under'} {target} to win {multiplier}x your bet!
                  </p>
                </div>
                
                <div className="w-40 h-40 bg-casino-primary/20 border-4 border-casino-primary rounded-lg flex items-center justify-center mb-6">
                  <span className={`text-5xl font-bold ${isRolling ? 'animate-pulse' : ''}`}>
                    {rollResult !== null ? rollResult : '?'}
                  </span>
                </div>
                
                <Button
                  className="bg-casino-primary hover:bg-casino-secondary px-8 py-4 text-xl mb-8"
                  onClick={handleRoll}
                  disabled={isRolling}
                >
                  {isRolling ? 'Rolling...' : 'Roll Dice'}
                </Button>
                
                <div className="w-full max-w-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-white">Target: {target}</span>
                    <Button 
                      variant="ghost" 
                      className="text-white"
                      onClick={toggleBetType}
                    >
                      {betType === 'over' ? 'Roll Over >' : 'Roll Under <'}
                    </Button>
                  </div>
                  
                  <Slider
                    defaultValue={[50]}
                    min={1}
                    max={99}
                    step={1}
                    value={[target]}
                    onValueChange={(values) => setTarget(values[0])}
                    className="mb-4"
                  />
                  
                  <div className="grid grid-cols-7 gap-2">
                    {[5, 25, 50, 75, 95].map((value) => (
                      <Button 
                        key={value}
                        variant="outline"
                        className="border-casino-primary/30 text-white"
                        onClick={() => setTarget(value)}
                      >
                        {value}
                      </Button>
                    ))}
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
                      disabled={isRolling}
                      className="w-full bg-casino-darker border border-casino-primary/30 rounded p-2 text-white"
                    />
                  </div>
                </div>
                
                <div className="p-3 bg-casino-darker rounded-md">
                  <p className="text-gray-400">Multiplier</p>
                  <p className="text-xl font-bold text-white">{multiplier}x</p>
                </div>
                
                <div className="p-3 bg-casino-darker rounded-md">
                  <p className="text-gray-400">Potential Win</p>
                  <p className="text-xl font-bold text-white">
                    ${(betAmount * multiplier).toFixed(2)}
                  </p>
                </div>
                
                <div className="p-3 bg-casino-darker rounded-md">
                  <p className="text-gray-400">Win Chance</p>
                  <p className="text-xl font-bold text-white">
                    {betType === 'over' ? 100 - target : target}%
                  </p>
                </div>
              </div>
              
              <div className="text-center text-xs text-gray-400 mt-6">
                <p>Lower win chance = higher multiplier</p>
                <p>House edge: 1%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
