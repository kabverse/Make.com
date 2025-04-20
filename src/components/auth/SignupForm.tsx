import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface SignupFormProps {
  onSuccess?: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhaar, setAadhaar] = useState("");

  const totalSteps = 2;

  const API_URL = "http://localhost:8080/api/auth";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < totalSteps) {
      // Validate current step
      if (step === 1) {
        if (!email || !password || !confirmPassword) {
          toast.error("Please fill all required fields");
          return;
        }

        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        if (password.length < 8) {
          toast.error("Password must be at least 8 characters");
          return;
        }
      }

      // Move to next step
      setStep(step + 1);
      return;
    }

    // Final submission
    if (!name || !mobile) {
      toast.error("Please fill all required fields");
      return;
    }

    if (mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (aadhaar && aadhaar.length !== 12) {
      toast.error("Aadhaar number must be 12 digits");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          mobile,
          aadhaar,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const userData = await response.json();

      // Store auth data in localStorage
      localStorage.setItem("authUser", JSON.stringify(userData));

      toast.success("Account created successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const formVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Create an Account
        <div className="text-sm font-normal text-gray-400 mt-1">
          Step {step} of {totalSteps}
        </div>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <motion.div variants={formVariants} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-casino-darker border-casino-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-casino-darker border-casino-primary/30"
              />
              <p className="text-xs text-gray-400">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-casino-darker border-casino-primary/30"
              />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div variants={formVariants} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-casino-darker border-casino-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="10-digit mobile number"
                required
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className="bg-casino-darker border-casino-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aadhaar">Aadhaar Number (Optional)</Label>
              <Input
                id="aadhaar"
                type="text"
                placeholder="12-digit Aadhaar number"
                value={aadhaar}
                onChange={(e) =>
                  setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))
                }
                className="bg-casino-darker border-casino-primary/30"
              />
            </div>
          </motion.div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              className="border-casino-primary/30 text-white"
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          )}

          <Button
            type="submit"
            className={`${
              step === totalSteps
                ? "bg-casino-highlight hover:bg-casino-highlight/90"
                : "bg-casino-primary hover:bg-casino-secondary"
            } ml-auto`}
            disabled={isLoading}
          >
            {isLoading
              ? "Creating account..."
              : step < totalSteps
              ? "Continue"
              : "Create Account"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
