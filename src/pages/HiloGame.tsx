
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

export default function HiloGame() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userBalance, setUserBalance] = useState(5000); // Dummy balance
  const [betAmount, setBetAmount] = useState(1);
  const [currentCard, setCurrentCard] = useState<number | null>(null);
  const [nextCard, setNextCard] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState(1.5);
  const [gameActive, setGameActive] = useState(false);
  const [result, setResult] = useState<string | null>(null);

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
    setResult(null);
    // Draw a random card (1-13)
    const initialCard = Math.floor(Math.random() * 13) + 1;
    setCurrentCard(initialCard);
    setNextCard(null);
  };

  const handleGuess = (guess: 'higher' | 'lower') => {
    if (!gameActive || currentCard === null) return;

    // Draw next card
    const newCard = Math.floor(Math.random() * 13) + 1;
    setNextCard(newCard);

    // Check if user guessed correctly
    let isCorrect = false;
    if (guess === 'higher' && newCard > currentCard) {
      isCorrect = true;
    } else if (guess === 'lower' && newCard < currentCard) {
      isCorrect = true;
    }

    if (isCorrect) {
      const winAmount = betAmount * multiplier;
      setUserBalance(prev => prev + winAmount);
      setResult('win');
      toast.success(`You won $${winAmount.toFixed(2)}!`);
    } else {
      setResult('lose');
      toast.error("Wrong guess! Better luck next time.");
    }

    setGameActive(false);
  };

  const getCardDisplay = (card: number | null) => {
    if (card === null) return '?';
    
    const suits = ['♠️', '♥️', '♦️', '♣️'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[card - 1];
    
    return `${value}${suit}`;
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Hi-Lo</h1>
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
                  <h2 className="text-xl font-bold text-white mb-2">Hi-Lo Card Game</h2>
                  <p className="text-gray-400">Predict if the next card will be higher or lower!</p>
                </div>
                
                <div className="flex justify-center items-center gap-8 mb-6">
                  <div className="w-32 h-48 bg-casino-primary/20 border-2 border-casino-primary rounded-lg flex items-center justify-center text-4xl">
                    {getCardDisplay(currentCard)}
                  </div>
                  <div className="text-3xl">→</div>
                  <div className="w-32 h-48 bg-casino-primary/20 border-2 border-casino-primary rounded-lg flex items-center justify-center text-4xl">
                    {getCardDisplay(nextCard)}
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button
                    className="bg-green-600 hover:bg-green-700 px-8 py-4 text-xl"
                    onClick={() => handleGuess('higher')}
                    disabled={!gameActive}
                  >
                    Higher ↑
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 px-8 py-4 text-xl"
                    onClick={() => handleGuess('lower')}
                    disabled={!gameActive}
                  >
                    Lower ↓
                  </Button>
                </div>
                
                {result && (
                  <div className={`mt-6 text-xl font-bold ${result === 'win' ? 'text-green-500' : 'text-red-500'}`}>
                    {result === 'win' ? 'You Won!' : 'You Lost!'}
                  </div>
                )}
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
                
                <div className="p-3 bg-casino-darker rounded-md">
                  <p className="text-gray-400">Multiplier</p>
                  <p className="text-xl font-bold text-white">{multiplier.toFixed(2)}x</p>
                </div>
                
                <div className="p-3 bg-casino-darker rounded-md">
                  <p className="text-gray-400">Potential Win</p>
                  <p className="text-xl font-bold text-white">
                    ${(betAmount * multiplier).toFixed(2)}
                  </p>
                </div>
                
                {!gameActive ? (
                  <Button 
                    className="w-full bg-casino-primary hover:bg-casino-secondary"
                    onClick={startGame}
                  >
                    Start Game
                  </Button>
                ) : (
                  <p className="text-center text-white">Make your prediction!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
