
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

interface TowerLevel {
  level: number;
  multiplier: number;
  completed: boolean;
  failed: boolean;
}

export default function TowerGame() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userBalance, setUserBalance] = useState(5000); // Dummy balance
  const [betAmount, setBetAmount] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [towerLevels, setTowerLevels] = useState<TowerLevel[]>([]);
  
  // Initialize tower levels
  useEffect(() => {
    const levels = Array.from({ length: 10 }, (_, i) => ({
      level: i + 1,
      multiplier: Number((1.5 * (i + 1)).toFixed(2)),
      completed: false,
      failed: false
    }));
    setTowerLevels(levels);
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
    setGameActive(true);
    setCurrentLevel(0);
    
    // Reset tower
    const resetLevels = towerLevels.map(level => ({
      ...level,
      completed: false,
      failed: false
    }));
    setTowerLevels(resetLevels);
  };

  const climbTower = () => {
    if (!gameActive) return;
    
    // Determine success based on random chance
    // Higher levels have lower success rates
    const successRate = 0.7 - (currentLevel * 0.05);
    const isSuccess = Math.random() < successRate;
    
    if (isSuccess) {
      // Successfully climbed to next level
      const newLevel = currentLevel + 1;
      setCurrentLevel(newLevel);
      
      // Update tower levels
      const updatedLevels = [...towerLevels];
      updatedLevels[currentLevel] = {
        ...updatedLevels[currentLevel],
        completed: true
      };
      setTowerLevels(updatedLevels);
      
      // Check if reached the top
      if (newLevel === towerLevels.length) {
        const winAmount = betAmount * towerLevels[towerLevels.length - 1].multiplier;
        setUserBalance(prev => prev + winAmount);
        setGameActive(false);
        toast.success(`Congratulations! You reached the top and won $${winAmount.toFixed(2)}!`);
      } else {
        toast.success(`Climbed to level ${newLevel + 1}!`);
      }
    } else {
      // Failed attempt
      const updatedLevels = [...towerLevels];
      updatedLevels[currentLevel] = {
        ...updatedLevels[currentLevel],
        failed: true
      };
      setTowerLevels(updatedLevels);
      setGameActive(false);
      toast.error("You fell from the tower! Game over.");
    }
  };

  const cashOut = () => {
    if (!gameActive || currentLevel === 0) return;
    
    const winAmount = betAmount * towerLevels[currentLevel - 1].multiplier;
    setUserBalance(prev => prev + winAmount);
    setGameActive(false);
    toast.success(`You cashed out with $${winAmount.toFixed(2)}!`);
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Dragon Tower</h1>
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
                  <h2 className="text-xl font-bold text-white mb-2">Dragon Tower Challenge</h2>
                  <p className="text-gray-400">Climb the tower for bigger multipliers, but beware of falling!</p>
                </div>
                
                <div className="grid grid-cols-1 gap-2 w-full max-w-md mb-6">
                  {towerLevels.slice().reverse().map((level) => (
                    <div 
                      key={level.level}
                      className={`p-3 rounded-md flex justify-between items-center ${
                        level.completed ? "bg-green-600" : 
                        level.failed ? "bg-red-600" : 
                        level.level === 10 - currentLevel ? "bg-casino-primary animate-pulse" : 
                        "bg-casino-darker"
                      }`}
                    >
                      <span className="font-bold">Level {level.level}</span>
                      <span>{level.multiplier}x</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  {gameActive && (
                    <>
                      <Button
                        className="bg-green-600 hover:bg-green-700 px-6"
                        onClick={climbTower}
                      >
                        Climb Higher
                      </Button>
                      <Button
                        className="bg-yellow-600 hover:bg-yellow-700 px-6"
                        onClick={cashOut}
                      >
                        Cash Out
                      </Button>
                    </>
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
                      disabled={gameActive}
                      className="w-full bg-casino-darker border border-casino-primary/30 rounded p-2 text-white"
                    />
                  </div>
                </div>
                
                {currentLevel > 0 && (
                  <div className="p-3 bg-casino-darker rounded-md">
                    <p className="text-gray-400">Current Level Multiplier</p>
                    <p className="text-xl font-bold text-white">
                      {towerLevels[currentLevel - 1].multiplier}x
                    </p>
                  </div>
                )}
                
                <div className="p-3 bg-casino-darker rounded-md">
                  <p className="text-gray-400">Potential Win (Top Level)</p>
                  <p className="text-xl font-bold text-white">
                    ${(betAmount * towerLevels[towerLevels.length - 1].multiplier).toFixed(2)}
                  </p>
                </div>
                
                {!gameActive && (
                  <Button 
                    className="w-full bg-casino-primary hover:bg-casino-secondary"
                    onClick={startGame}
                  >
                    Start Game
                  </Button>
                )}
              </div>
              
              <div className="text-center text-xs text-gray-400 mt-6">
                <p>Higher levels have higher risk of falling!</p>
                <p>Cash out anytime to secure your winnings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
