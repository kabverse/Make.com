
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

interface Card {
  suit: string;
  value: string;
  numericValue: number;
}

export default function BlackjackGame() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userBalance, setUserBalance] = useState(5000); // Dummy balance
  const [betAmount, setBetAmount] = useState(10);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'dealerTurn' | 'gameOver'>('idle');
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'push' | null>(null);

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

  // Create a deck of cards
  const createDeck = (): Card[] => {
    const suits = ['♠️', '♥️', '♦️', '♣️'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    const deck: Card[] = [];
    for (const suit of suits) {
      for (const value of values) {
        let numericValue: number;
        if (value === 'A') {
          numericValue = 11; // Ace can be 1 or 11
        } else if (['J', 'Q', 'K'].includes(value)) {
          numericValue = 10;
        } else {
          numericValue = parseInt(value);
        }
        
        deck.push({ suit, value, numericValue });
      }
    }
    
    return shuffle(deck);
  };

  // Shuffle array using Fisher-Yates algorithm
  const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Draw a card from the deck
  const drawCard = (): Card => {
    const deck = createDeck();
    return deck[Math.floor(Math.random() * deck.length)];
  };

  // Calculate hand value
  const calculateHandValue = (hand: Card[]): number => {
    let value = hand.reduce((total, card) => total + card.numericValue, 0);
    let aces = hand.filter(card => card.value === 'A').length;
    
    // Adjust for aces
    while (value > 21 && aces > 0) {
      value -= 10; // Convert an ace from 11 to 1
      aces--;
    }
    
    return value;
  };

  // Start a new game
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
    
    const playerCards = [drawCard(), drawCard()];
    const dealerCards = [drawCard(), drawCard()];
    
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setGameState('playing');
    setGameResult(null);
    
    // Check for natural blackjack
    const playerValue = calculateHandValue(playerCards);
    const dealerValue = calculateHandValue(dealerCards);
    
    if (playerValue === 21 && dealerValue === 21) {
      setGameState('gameOver');
      setGameResult('push');
      setUserBalance(prev => prev + betAmount); // Return bet on push
      toast.info("Both have Blackjack! It's a push.");
    } else if (playerValue === 21) {
      setGameState('gameOver');
      setGameResult('win');
      const winAmount = betAmount * 2.5;
      setUserBalance(prev => prev + winAmount);
      toast.success(`Blackjack! You won $${winAmount.toFixed(2)}!`);
    } else if (dealerValue === 21) {
      setGameState('gameOver');
      setGameResult('lose');
      toast.error("Dealer has Blackjack! You lose.");
    }
  };

  // Player action: Hit
  const handleHit = () => {
    if (gameState !== 'playing') return;
    
    const newCard = drawCard();
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    
    const handValue = calculateHandValue(newHand);
    
    if (handValue > 21) {
      setGameState('gameOver');
      setGameResult('lose');
      toast.error("Bust! You went over 21.");
    }
  };

  // Player action: Stand
  const handleStand = () => {
    if (gameState !== 'playing') return;
    
    setGameState('dealerTurn');
    
    // Dealer's turn
    let currentDealerHand = [...dealerHand];
    let dealerValue = calculateHandValue(currentDealerHand);
    
    // Dealer draws until 17 or higher
    const dealerPlay = () => {
      if (dealerValue < 17) {
        const newCard = drawCard();
        currentDealerHand = [...currentDealerHand, newCard];
        setDealerHand(currentDealerHand);
        dealerValue = calculateHandValue(currentDealerHand);
        
        setTimeout(dealerPlay, 1000);
      } else {
        // Determine winner
        const playerValue = calculateHandValue(playerHand);
        
        setGameState('gameOver');
        
        if (dealerValue > 21) {
          setGameResult('win');
          const winAmount = betAmount * 2;
          setUserBalance(prev => prev + winAmount);
          toast.success(`Dealer bust! You won $${winAmount.toFixed(2)}!`);
        } else if (playerValue > dealerValue) {
          setGameResult('win');
          const winAmount = betAmount * 2;
          setUserBalance(prev => prev + winAmount);
          toast.success(`You won $${winAmount.toFixed(2)}!`);
        } else if (playerValue < dealerValue) {
          setGameResult('lose');
          toast.error("Dealer wins!");
        } else {
          setGameResult('push');
          setUserBalance(prev => prev + betAmount); // Return bet on push
          toast.info("It's a push!");
        }
      }
    };
    
    dealerPlay();
  };

  // Render card
  const renderCard = (card: Card) => {
    const color = card.suit === '♥️' || card.suit === '♦️' ? 'text-red-500' : 'text-white';
    
    return (
      <div className="w-14 h-20 bg-white rounded-md border border-gray-300 flex flex-col items-center justify-center">
        <div className={`text-xs font-bold ${color}`}>{card.value}</div>
        <div className={`text-lg ${color}`}>{card.suit}</div>
      </div>
    );
  };

  // Render a face-down card
  const renderHiddenCard = () => {
    return (
      <div className="w-14 h-20 bg-casino-primary rounded-md border border-gray-300 flex items-center justify-center">
        <div className="text-2xl">?</div>
      </div>
    );
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Blackjack</h1>
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
              <div className="flex flex-col">
                <div className="mb-8 text-center">
                  <h2 className="text-xl font-bold text-white mb-2">Blackjack</h2>
                  <p className="text-gray-400">Get closer to 21 than the dealer without going over!</p>
                </div>
                
                {/* Game table */}
                <div className="bg-green-800 rounded-xl p-6 mb-6">
                  {/* Dealer hand */}
                  <div className="mb-8">
                    <h3 className="text-white mb-2">Dealer's Hand {gameState !== 'idle' && gameState !== 'playing' && `(${calculateHandValue(dealerHand)})`}</h3>
                    <div className="flex gap-2">
                      {dealerHand.length > 0 ? (
                        <>
                          {renderCard(dealerHand[0])}
                          {gameState === 'playing' ? renderHiddenCard() : dealerHand.slice(1).map((card, index) => renderCard(card))}
                        </>
                      ) : (
                        <div className="text-gray-300">No cards yet</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Player hand */}
                  <div>
                    <h3 className="text-white mb-2">Your Hand ({calculateHandValue(playerHand)})</h3>
                    <div className="flex gap-2 flex-wrap">
                      {playerHand.length > 0 ? (
                        playerHand.map((card, index) => renderCard(card))
                      ) : (
                        <div className="text-gray-300">No cards yet</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Game controls */}
                <div className="flex justify-center gap-4">
                  {gameState === 'idle' ? (
                    <Button
                      className="bg-casino-primary hover:bg-casino-secondary px-8 py-4 text-xl"
                      onClick={startGame}
                    >
                      Deal Cards
                    </Button>
                  ) : gameState === 'playing' ? (
                    <>
                      <Button
                        className="bg-green-600 hover:bg-green-700 px-6"
                        onClick={handleHit}
                      >
                        Hit
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700 px-6"
                        onClick={handleStand}
                      >
                        Stand
                      </Button>
                    </>
                  ) : gameState === 'gameOver' ? (
                    <Button
                      className="bg-casino-primary hover:bg-casino-secondary px-8"
                      onClick={() => setGameState('idle')}
                    >
                      New Game
                    </Button>
                  ) : (
                    <div className="text-white">Dealer's turn...</div>
                  )}
                </div>
                
                {/* Game result */}
                {gameResult && (
                  <div className={`mt-6 text-center text-xl font-bold ${
                    gameResult === 'win' ? 'text-green-500' : 
                    gameResult === 'lose' ? 'text-red-500' : 'text-yellow-500'
                  }`}>
                    {gameResult === 'win' ? 'You Won!' : 
                     gameResult === 'lose' ? 'You Lost!' : 'Push (Tie)'}
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
                      disabled={gameState !== 'idle'}
                      className="w-full bg-casino-darker border border-casino-primary/30 rounded p-2 text-white"
                    />
                  </div>
                </div>
                
                <div className="p-3 bg-casino-darker rounded-md">
                  <p className="text-gray-400">Blackjack Pays</p>
                  <p className="text-xl font-bold text-white">3:2</p>
                </div>
                
                <div className="p-3 bg-casino-darker rounded-md">
                  <p className="text-gray-400">Potential Win (Blackjack)</p>
                  <p className="text-xl font-bold text-white">
                    ${(betAmount * 2.5).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="text-center text-xs text-gray-400 mt-6">
                <p>Dealer stands on 17</p>
                <p>Blackjack pays 3:2</p>
                <p>Regular win pays 1:1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
