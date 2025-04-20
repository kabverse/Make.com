
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface BankDetailsProps {
  balance: number;
  onWithdraw: (amount: number) => void;
}

export default function BankDetails({ balance, onWithdraw }: BankDetailsProps) {
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawAmount = parseFloat(amount);
    
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (withdrawAmount > balance) {
      toast.error("Insufficient balance");
      return;
    }
    
    if (withdrawAmount < 10) {
      toast.error("Minimum withdrawal amount is $10");
      return;
    }
    
    if (accountNumber !== confirmAccountNumber) {
      toast.error("Account numbers do not match");
      return;
    }
    
    if (!accountNumber || !ifscCode || !accountName) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (ifscCode.length < 8) {
      toast.error("Please enter a valid IFSC code");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate withdrawal processing
    setTimeout(() => {
      setIsProcessing(false);
      onWithdraw(withdrawAmount);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="bg-casino-darker p-4 rounded-lg border border-casino-primary/20 mb-4">
        <div className="text-gray-400 text-sm">Available Balance</div>
        <div className="text-2xl font-bold text-white">${balance.toFixed(2)}</div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Withdrawal Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          min={10}
          max={balance}
          className="bg-casino-darker border-casino-primary/30"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="accountName">Account Holder Name</Label>
        <Input
          id="accountName"
          type="text"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Enter account holder name"
          className="bg-casino-darker border-casino-primary/30"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter account number"
          className="bg-casino-darker border-casino-primary/30"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmAccountNumber">Confirm Account Number</Label>
        <Input
          id="confirmAccountNumber"
          type="text"
          value={confirmAccountNumber}
          onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ''))}
          placeholder="Confirm account number"
          className="bg-casino-darker border-casino-primary/30"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ifscCode">IFSC Code</Label>
        <Input
          id="ifscCode"
          type="text"
          value={ifscCode}
          onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
          placeholder="e.g. SBIN0000123"
          className="bg-casino-darker border-casino-primary/30"
          required
        />
      </div>
      
      <div className="text-xs text-gray-400 mt-2">
        <p>- Minimum withdrawal amount is $10</p>
        <p>- Processing time: 1-2 business days</p>
        <p>- Verify your account details before proceeding</p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-casino-primary hover:bg-casino-secondary"
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Withdraw Funds"}
      </Button>
    </form>
  );
}
