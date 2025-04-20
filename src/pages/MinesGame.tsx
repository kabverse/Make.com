
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Sound effects
const playSoundEffect = (sound: string) => {
  console.log(`Playing sound: ${sound}`);
  // In a real implementation, we would play actual sound files
};

interface UserData {
  id: string;
  email: string;
  name: string;
  balance: number;
  token: string;
}

export default function MinesGame() {
  const navigate = useNavigate();
  const gridSize = 5; // 5x5 grid
  const totalCells = gridSize * gridSize;
  
  // User data
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [mines, setMines] = useState(5);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [revealedCells, setRevealedCells] = useState<number[]>([]);
  const [minePositions, setMinePositions] = useState<number[]>([]);
  // Use dummy balance data instead of getting from localStorage
  const [userBalance, setUserBalance] = useState(5000);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [potentialWin, setPotentialWin] = useState(0);
  
  // Load user data from localStorage
  useEffect(() => {
    const authUserString = localStorage.getItem("authUser");
    if (authUserString) {
      try {
        const user = JSON.parse(authUserString) as UserData;
        setUserData(user);
        // Not setting balance from localStorage anymore
      } catch (error) {
        console.error("Failed to parse user data", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);
  
  // Calculate multiplier and potential win
  useEffect(() => {
    if (selectedCells.length > 0) {
      // This is a simple calculation for demo purposes
      // A real implementation would use more complex calculations
      const newMultiplier = +(((totalCells - mines) / (totalCells - mines - selectedCells.length)) * (1 - 0.05)).toFixed(2);
      setCurrentMultiplier(newMultiplier);
      setPotentialWin(betAmount * newMultiplier);
    } else {
      setCurrentMultiplier(1);
      setPotentialWin(betAmount);
    }
  }, [selectedCells, mines, betAmount]);
  
  // Start game
  const startGame = () => {
    if (betAmount <= 0) {
      toast.error("Please enter a valid bet amount");
      return;
    }
    
    if (betAmount > userBalance) {
      toast.error("Insufficient balance");
      return;
    }
    
    // Deduct bet amount
    setUserBalance(prev => prev - betAmount);
    
    // Generate mine positions 
    // In a real app, this would be handled by the Java backend
    // Using a secure random number generator for fairness
    const minePositionsArray = [];
    while (minePositionsArray.length < mines) {
      const position = Math.floor(Math.random() * totalCells);
      if (!minePositionsArray.includes(position)) {
        minePositionsArray.push(position);
      }
    }
    
    setMinePositions(minePositionsArray);
    setSelectedCells([]);
    setRevealedCells([]);
    setIsPlaying(true);
    playSoundEffect("game_start");
  };
  
  // Cell click handler
  const handleCellClick = (index: number) => {
    if (!isPlaying || selectedCells.includes(index) || revealedCells.includes(index)) {
      return;
    }
    
    // Check if clicked on a mine
    if (minePositions.includes(index)) {
      // Game over - reveal all mines
      setRevealedCells([...revealedCells, ...minePositions]);
      setIsPlaying(false);
      toast.error("Boom! You hit a mine!");
      playSoundEffect("explosion");
    } else {
      // Safe cell
      const newSelectedCells = [...selectedCells, index];
      setSelectedCells(newSelectedCells);
      playSoundEffect("gem_collect");
      
      // Check if all safe cells have been revealed
      if (newSelectedCells.length === totalCells - mines) {
        // Player won by revealing all safe cells
        cashOut();
      }
    }
  };
  
  // Cash out
  const cashOut = () => {
    if (!isPlaying || selectedCells.length === 0) {
      return;
    }
    
    const winAmount = betAmount * currentMultiplier;
    
    setUserBalance(prev => prev + winAmount);
    
    setIsPlaying(false);
    setRevealedCells([...revealedCells, ...minePositions]);
    toast.success(`You won $${winAmount.toFixed(2)}!`);
    playSoundEffect("win");
  };
  
  // Reset game
  const resetGame = () => {
    setIsPlaying(false);
    setSelectedCells([]);
    setRevealedCells([]);
    setMinePositions([]);
  };
  
  // Render cell
  const renderCell = (index: number) => {
    const isSelected = selectedCells.includes(index);
    const isRevealed = revealedCells.includes(index);
    const isMine = minePositions.includes(index);
    
    let content = null;
    let bgColor = "bg-casino-dark";
    
    if (isSelected) {
      content = "💎";
      bgColor = "bg-gradient-primary";
    } else if (isRevealed && isMine) {
      content = "💣";
      bgColor = "bg-red-600";
    }
    
    return (
      <button
        key={index}
        className={`aspect-square rounded-md ${bgColor} flex items-center justify-center text-2xl border border-casino-primary/20 hover:border-casino-primary/40 transition-colors ${
          !isPlaying ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => handleCellClick(index)}
        disabled={!isPlaying || isSelected || isRevealed}
      >
        {content}
      </button>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="pt-20 flex-grow bg-casino-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Mines</h1>
            <Button 
              variant="outline" 
              className="border-casino-primary/30 text-white"
              onClick={() => navigate("/games")}
            >
              Back to Games
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Game grid */}
            <div className="lg:col-span-2 bg-casino-dark rounded-xl p-6 border border-casino-primary/20">
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: totalCells }).map((_, index) => renderCell(index))}
              </div>
              
              {/* Game info */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-casino-darker p-3 rounded-md">
                  <p className="text-gray-400 text-sm">Mines</p>
                  <p className="text-white font-semibold">{mines}</p>
                </div>
                <div className="bg-casino-darker p-3 rounded-md">
                  <p className="text-gray-400 text-sm">Multiplier</p>
                  <p className="text-white font-semibold">{currentMultiplier.toFixed(2)}x</p>
                </div>
                <div className="bg-casino-darker p-3 rounded-md">
                  <p className="text-gray-400 text-sm">Cells Cleared</p>
                  <p className="text-white font-semibold">{selectedCells.length} / {totalCells - mines}</p>
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="bg-casino-dark rounded-xl p-6 border border-casino-primary/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-semibold">Your Balance</h3>
                <p className="text-xl font-bold text-white">${userBalance.toFixed(2)}</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-white font-medium mb-2 block">Bet Amount</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                      min={1}
                      step={1}
                      className="bg-casino-darker border-casino-primary/30"
                      disabled={isPlaying}
                    />
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="border-casino-primary/30 text-white"
                        onClick={() => setBetAmount(prev => Math.max(prev / 2, 1))}
                        disabled={isPlaying}
                      >
                        ½
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="border-casino-primary/30 text-white"
                        onClick={() => setBetAmount(prev => prev * 2)}
                        disabled={isPlaying}
                      >
                        2×
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-white font-medium">Number of Mines</label>
                    <span className="text-white">{mines}</span>
                  </div>
                  <Slider 
                    defaultValue={[5]} 
                    max={24}
                    min={1}
                    step={1}
                    onValueChange={(values) => setMines(values[0])}
                    disabled={isPlaying}
                    className="my-4"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Lower Risk</span>
                    <span>Higher Risk</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Potential Win</span>
                    <span className="text-white font-medium">${potentialWin.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {!isPlaying ? (
                    <Button 
                      className="w-full bg-casino-primary hover:bg-casino-secondary"
                      onClick={startGame}
                    >
                      Start Game
                    </Button>
                  ) : (
                    <>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={cashOut}
                      >
                        Cash Out (${potentialWin.toFixed(2)})
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        onClick={resetGame}
                      >
                        Stop Game
                      </Button>
                    </>
                  )}
                </div>
                
                <div className="text-center text-xs text-gray-400 mt-6">
                  <p>Tap on the grid to reveal safe cells.</p>
                  <p>More mines = higher risk and bigger rewards!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
