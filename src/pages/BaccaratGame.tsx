
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

type BetType = 'player' | 'banker' | 'tie' | null;

export default function BaccaratGame() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userBalance, setUserBalance] = useState(5000); // Dummy balance
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState<BetType>(null);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [bankerHand, setBankerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'dealing' | 'complete'>('idle');
  const [result, setResult] = useState<BetType | null>(null);

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

  // Draw a card from the deck
  const drawCard = (): Card => {
    const suits = ['♠️', '♥️', '♦️', '♣️'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const valueIndex = Math.floor(Math.random() * values.length);
    const value = values[valueIndex];
    
    // In Baccarat, cards 10, J, Q, K count as 0
    // Aces count as 1
    // 2-9 count as their face value
    let numericValue: number;
    if (['10', 'J', 'Q', 'K'].includes(value)) {
      numericValue = 0;
    } else if (value === 'A') {
      numericValue = 1;
    } else {
      numericValue = parseInt(value);
    }
    
    return { suit, value, numericValue };
  };

  // Calculate hand value in Baccarat (only the last digit counts)
  const calculateBaccaratValue = (hand: Card[]): number => {
    const total = hand.reduce((sum, card) => sum + card.numericValue, 0);
    return total % 10; // Only the last digit counts in Baccarat
  };

  // Start a new game
  const startGame = () => {
    if (!selectedBet) {
      toast.error("Please select a bet type");
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

    setUserBalance(prev => prev - betAmount);
    setGameState('dealing');
    
    // Deal initial two cards to player and banker
    const pHand = [drawCard(), drawCard()];
    const bHand = [drawCard(), drawCard()];
    
    setPlayerHand(pHand);
    setBankerHand(bHand);
    
    // Calculate initial values
    const playerValue = calculateBaccaratValue(pHand);
    const bankerValue = calculateBaccaratValue(bHand);
    
    // Check for natural (8 or 9)
    if (playerValue >= 8 || bankerValue >= 8) {
      determineWinner(pHand, bHand);
    } else {
      // Apply third card rules
      setTimeout(() => {
        let finalPlayerHand = [...pHand];
        let finalBankerHand = [...bHand];
        
        // Player draws a third card if total is 0-5
        if (playerValue <= 5) {
          const thirdCard = drawCard();
          finalPlayerHand = [...finalPlayerHand, thirdCard];
          setPlayerHand(finalPlayerHand);
          
          // Banker's turn is based on complex rules considering player's third card
          setTimeout(() => {
            // Simplified banker rules - in a real app, this would follow the full Baccarat rules
            if (bankerValue <= 5) {
              const bankerThirdCard = drawCard();
              finalBankerHand = [...finalBankerHand, bankerThirdCard];
              setBankerHand(finalBankerHand);
            }
            
            // Determine final winner
            setTimeout(() => {
              determineWinner(finalPlayerHand, finalBankerHand);
            }, 1000);
          }, 1000);
        } else {
          // Player stands, banker draws if 0-5
          if (bankerValue <= 5) {
            const bankerThirdCard = drawCard();
            finalBankerHand = [...finalBankerHand, bankerThirdCard];
            setBankerHand(finalBankerHand);
          }
          
          // Determine winner
          setTimeout(() => {
            determineWinner(finalPlayerHand, finalBankerHand);
          }, 1000);
        }
      }, 1000);
    }
  };

  // Determine the winner
  const determineWinner = (playerCards: Card[], bankerCards: Card[]) => {
    const playerValue = calculateBaccaratValue(playerCards);
    const bankerValue = calculateBaccaratValue(bankerCards);
    
    let winner: BetType;
    
    if (playerValue > bankerValue) {
      winner = 'player';
    } else if (bankerValue > playerValue) {
      winner = 'banker';
    } else {
      winner = 'tie';
    }
    
    setResult(winner);
    setGameState('complete');
    
    // Award winnings
    if (selectedBet === winner) {
      let winMultiplier: number;
      
      if (winner === 'player') {
        winMultiplier = 2; // 1:1 payout
      } else if (winner === 'banker') {
        winMultiplier = 1.95; // 0.95:1 payout (5% commission)
      } else {
        winMultiplier = 9; // 8:1 payout
      }
      
      const winAmount = betAmount * winMultiplier;
      setUserBalance(prev => prev + winAmount);
      toast.success(`You won $${winAmount.toFixed(2)}!`);
    } else {
      toast.error(`${winner === 'player' ? 'Player' : winner === 'banker' ? 'Banker' : 'Tie'} wins! You lost.`);
    }
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

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="pt-20 flex-grow bg-casino-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Baccarat</h1>
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
                  <h2 className="text-xl font-bold text-white mb-2">Baccarat</h2>
                  <p className="text-gray-400">Bet on Player, Banker, or Tie!</p>
                </div>
                
                {/* Game table */}
                <div className="bg-green-800 rounded-xl p-6 mb-6">
                  {/* Player hand */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white">Player</h3>
                      <span className="bg-casino-dark px-2 py-1 rounded text-white">
                        {playerHand.length > 0 ? calculateBaccaratValue(playerHand) : '-'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {playerHand.length > 0 ? (
                        playerHand.map((card, index) => renderCard(card))
                      ) : (
                        <div className="text-gray-300">No cards yet</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Banker hand */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white">Banker</h3>
                      <span className="bg-casino-dark px-2 py-1 rounded text-white">
                        {bankerHand.length > 0 ? calculateBaccaratValue(bankerHand) : '-'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {bankerHand.length > 0 ? (
                        bankerHand.map((card, index) => renderCard(card))
                      ) : (
                        <div className="text-gray-300">No cards yet</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Betting options */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Button 
                    className={`py-4 ${
                      selectedBet === 'player' 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-casino-darker hover:bg-casino-dark'
                    } ${result === 'player' ? 'ring-2 ring-yellow-400' : ''}`}
                    onClick={() => gameState === 'idle' && setSelectedBet('player')}
                    disabled={gameState !== 'idle'}
                  >
                    Player (1:1)
                  </Button>
                  <Button 
                    className={`py-4 ${
                      selectedBet === 'banker' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-casino-darker hover:bg-casino-dark'
                    } ${result === 'banker' ? 'ring-2 ring-yellow-400' : ''}`}
                    onClick={() => gameState === 'idle' && setSelectedBet('banker')}
                    disabled={gameState !== 'idle'}
                  >
                    Banker (0.95:1)
                  </Button>
                  <Button 
                    className={`py-4 ${
                      selectedBet === 'tie' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-casino-darker hover:bg-casino-dark'
                    } ${result === 'tie' ? 'ring-2 ring-yellow-400' : ''}`}
                    onClick={() => gameState === 'idle' && setSelectedBet('tie')}
                    disabled={gameState !== 'idle'}
                  >
                    Tie (8:1)
                  </Button>
                </div>
                
                {/* Game controls */}
                <div className="flex justify-center">
                  {gameState === 'idle' ? (
                    <Button
                      className="bg-casino-primary hover:bg-casino-secondary px-8 py-4 text-xl"
                      onClick={startGame}
                      disabled={!selectedBet}
                    >
                      Deal Cards
                    </Button>
                  ) : gameState === 'dealing' ? (
                    <div className="text-white text-xl">Dealing cards...</div>
                  ) : (
                    <Button
                      className="bg-casino-primary hover:bg-casino-secondary px-8 py-4 text-xl"
                      onClick={() => {
                        setGameState('idle');
                        setPlayerHand([]);
                        setBankerHand([]);
                        setResult(null);
                      }}
                    >
                      New Game
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
                      disabled={gameState !== 'idle'}
                      className="w-full bg-casino-darker border border-casino-primary/30 rounded p-2 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="p-2 bg-casino-darker rounded-md flex justify-between">
                    <p className="text-gray-400">Player win pays</p>
                    <p className="text-white">1:1</p>
                  </div>
                  <div className="p-2 bg-casino-darker rounded-md flex justify-between">
                    <p className="text-gray-400">Banker win pays</p>
                    <p className="text-white">0.95:1 (5% commission)</p>
                  </div>
                  <div className="p-2 bg-casino-darker rounded-md flex justify-between">
                    <p className="text-gray-400">Tie win pays</p>
                    <p className="text-white">8:1</p>
                  </div>
                </div>
                
                <div className="p-3 bg-casino-darker rounded-md">
                  <p className="text-gray-400">Selected Bet</p>
                  <p className="text-xl font-bold text-white capitalize">
                    {selectedBet || 'None'}
                  </p>
                </div>
              </div>
              
              <div className="text-center text-xs text-gray-400 mt-6">
                <p>In Baccarat, cards 2-9 are worth their face value.</p>
                <p>10, J, Q, and K are worth 0. Aces are worth 1.</p>
                <p>Only the last digit of the total counts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
