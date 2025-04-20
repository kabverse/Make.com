
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Games from "./pages/Games";
import MinesGame from "./pages/MinesGame";
import RouletteGame from "./pages/RouletteGame";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Create placeholder game components for all other games
import HiloGame from "./pages/HiloGame";
import TowerGame from "./pages/TowerGame";
import DiceGame from "./pages/DiceGame";
import CrashGame from "./pages/CrashGame";
import SlotsGame from "./pages/SlotsGame";
import PlinkoGame from "./pages/PlinkoGame";
import BlackjackGame from "./pages/BlackjackGame";
import BaccaratGame from "./pages/BaccaratGame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/games" element={
            <ProtectedRoute>
              <Games />
            </ProtectedRoute>
          } />
          <Route path="/games/mines" element={
            <ProtectedRoute>
              <MinesGame />
            </ProtectedRoute>
          } />
          <Route path="/games/roulette" element={
            <ProtectedRoute>
              <RouletteGame />
            </ProtectedRoute>
          } />
          <Route path="/games/hilo" element={
            <ProtectedRoute>
              <HiloGame />
            </ProtectedRoute>
          } />
          <Route path="/games/tower" element={
            <ProtectedRoute>
              <TowerGame />
            </ProtectedRoute>
          } />
          <Route path="/games/dice" element={
            <ProtectedRoute>
              <DiceGame />
            </ProtectedRoute>
          } />
          <Route path="/games/crash" element={
            <ProtectedRoute>
              <CrashGame />
            </ProtectedRoute>
          } />
          <Route path="/games/slots" element={
            <ProtectedRoute>
              <SlotsGame />
            </ProtectedRoute>
          } />
          <Route path="/games/plinko" element={
            <ProtectedRoute>
              <PlinkoGame />
            </ProtectedRoute>
          } />
          <Route path="/games/blackjack" element={
            <ProtectedRoute>
              <BlackjackGame />
            </ProtectedRoute>
          } />
          <Route path="/games/baccarat" element={
            <ProtectedRoute>
              <BaccaratGame />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
