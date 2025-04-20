
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  CreditCard,
  Smartphone
} from "lucide-react";

interface WalletDialogProps {
  balance: number;
  onDeposit: (amount: number) => void;
  onWithdraw: () => void;
}

export default function WalletDialog({ balance, onDeposit, onWithdraw }: WalletDialogProps) {
  const [depositAmount, setDepositAmount] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (depositAmount < 10) {
      toast.error("Minimum deposit amount is $10");
      return;
    }
    
    if (paymentMethod === "upi" && !upiId) {
      toast.error("Please enter a UPI ID");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onDeposit(depositAmount);
    }, 1500);
  };

  const presetAmounts = [100, 200, 500, 1000, 2000];

  return (
    <div className="space-y-4 mt-4">
      <div className="bg-casino-darker p-4 rounded-lg border border-casino-primary/20">
        <div className="text-gray-400 text-sm">Your Balance</div>
        <div className="text-2xl font-bold text-white">${balance.toFixed(2)}</div>
      </div>
      
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-casino-darker">
          <TabsTrigger value="deposit" className="data-[state=active]:bg-casino-primary">
            Deposit
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="data-[state=active]:bg-casino-primary">
            Withdraw
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="deposit" className="space-y-4 mt-4">
          <form onSubmit={handleDeposit}>
            <div className="space-y-2 mb-4">
              <Label>Amount</Label>
              <Input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                min={10}
                className="bg-casino-darker border-casino-primary/30"
              />
              
              <div className="grid grid-cols-5 gap-2 mt-2">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className="bg-casino-darker border border-casino-primary/30 rounded py-1 text-sm font-medium hover:bg-casino-primary/20"
                    onClick={() => setDepositAmount(amount)}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`p-3 rounded-lg border ${
                    paymentMethod === "upi" 
                      ? "border-casino-primary bg-casino-primary/20" 
                      : "border-casino-primary/20 bg-casino-darker"
                  } flex items-center justify-center gap-2`}
                  onClick={() => setPaymentMethod("upi")}
                >
                  <Smartphone className="h-5 w-5" />
                  <span>UPI</span>
                </button>
                <button
                  type="button"
                  className={`p-3 rounded-lg border ${
                    paymentMethod === "card" 
                      ? "border-casino-primary bg-casino-primary/20" 
                      : "border-casino-primary/20 bg-casino-darker"
                  } flex items-center justify-center gap-2`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Card</span>
                </button>
              </div>
            </div>
            
            {paymentMethod === "upi" && (
              <div className="space-y-2 mb-4 animate-fade-in">
                <Label>UPI Options</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["GPay", "PhonePe", "Paytm"].map((app) => (
                    <button
                      key={app}
                      type="button"
                      className="p-2 rounded-lg border border-casino-primary/20 bg-casino-darker hover:bg-casino-primary/20"
                      onClick={() => setUpiId(`${app.toLowerCase()}@upi`)}
                    >
                      {app}
                    </button>
                  ))}
                </div>
                
                <div className="mt-2">
                  <Label>UPI ID</Label>
                  <Input
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="bg-casino-darker border-casino-primary/30"
                  />
                </div>
              </div>
            )}
            
            {paymentMethod === "card" && (
              <div className="space-y-2 mb-4 animate-fade-in">
                <div className="text-center py-2 text-gray-400">
                  Card payment integration will be implemented soon.
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-casino-primary hover:bg-casino-secondary"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Deposit"}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="withdraw" className="space-y-4 mt-4">
          <div className="text-center p-4 bg-casino-darker rounded-lg border border-casino-primary/20">
            <p className="text-gray-300 mb-4">
              Enter your bank details to withdraw funds
            </p>
            <Button 
              onClick={onWithdraw}
              className="bg-casino-primary hover:bg-casino-secondary"
            >
              Continue to Withdrawal
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
