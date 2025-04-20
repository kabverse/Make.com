import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Wallet, 
  LogOut, 
  Menu, 
  X
} from "lucide-react";
import { toast } from "sonner";
import ProfileForm from "../profile/ProfileForm";
import WalletDialog from "../wallet/WalletDialog";
import BankDetails from "../wallet/BankDetails";

interface UserData {
  id: string;
  email: string;
  name: string;
  balance: number;
  token: string;
  mobile?: string;
  aadhaar?: string;
}

export default function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userBalance, setUserBalance] = useState(5000);
  const [showWallet, setShowWallet] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);

  useEffect(() => {
    const authUserString = localStorage.getItem("authUser");
    if (authUserString) {
      try {
        const parsedUser = JSON.parse(authUserString) as UserData;
        setUserData(parsedUser);
      } catch (error) {
        console.error("Failed to parse auth user data", error);
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    setUserData(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleDeposit = (amount: number) => {
    setUserBalance(prev => prev + amount);
    toast.success(`Successfully deposited $${amount}`);
    setShowWallet(false);
  };

  const handleWithdrawal = (amount: number) => {
    if (amount > userBalance) {
      toast.error("Insufficient balance");
      return;
    }
    
    setUserBalance(prev => prev - amount);
    toast.success(`Withdrawal of $${amount} initiated`);
    setShowBankDetails(false);
  };

  if (!userData) {
    return null;
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-casino-darker/90 backdrop-blur-sm border-b border-casino-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/games" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-primary text-transparent bg-clip-text">
                MAKE.COM
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowWallet(true)}
              className="flex items-center gap-2 bg-casino-dark px-4 py-2 rounded-md border border-casino-primary/30 hover:glow transition-all"
            >
              <Wallet className="h-4 w-4 text-casino-primary" />
              <span className="text-white font-medium">${userBalance.toFixed(2)}</span>
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full bg-casino-dark border border-casino-primary/30">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-casino-dark border-casino-primary/30">
                <div className="px-2 py-1.5 text-sm border-b border-casino-primary/20">
                  <p className="font-medium text-white">{userData.name}</p>
                  <p className="text-xs text-gray-400">{userData.email}</p>
                </div>
                <DropdownMenuItem onClick={() => setShowProfile(true)} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowWallet(true)} className="cursor-pointer">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Wallet</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-casino-dark"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-casino-dark">
            <Link 
              to="/games" 
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Games
            </Link>
            <button 
              onClick={() => {
                setShowProfile(true);
                closeMenu();
              }}
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Profile
            </button>
            <button 
              onClick={() => {
                setShowWallet(true);
                closeMenu();
              }}
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Wallet
            </button>
            <button 
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
              className="text-red-400 hover:text-red-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Logout
            </button>
          </div>
        </div>
      )}
      
      <Dialog open={showWallet} onOpenChange={setShowWallet}>
        <DialogContent className="bg-casino-dark border-casino-primary/50">
          <DialogTitle className="text-xl font-bold text-white">Wallet</DialogTitle>
          <WalletDialog 
            balance={userBalance} 
            onDeposit={handleDeposit} 
            onWithdraw={() => {
              setShowWallet(false);
              setShowBankDetails(true);
            }} 
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="bg-casino-dark border-casino-primary/50">
          <DialogTitle className="text-xl font-bold text-white">Profile</DialogTitle>
          <ProfileForm 
            initialData={{
              name: userData.name,
              email: userData.email,
              mobile: userData.mobile || "",
              aadhaar: userData.aadhaar || ""
            }}
            onSuccess={() => setShowProfile(false)} 
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showBankDetails} onOpenChange={setShowBankDetails}>
        <DialogContent className="bg-casino-dark border-casino-primary/50">
          <DialogTitle className="text-xl font-bold text-white">Withdrawal</DialogTitle>
          <BankDetails 
            balance={userBalance} 
            onWithdraw={handleWithdrawal} 
          />
        </DialogContent>
      </Dialog>
    </header>
  );
}
