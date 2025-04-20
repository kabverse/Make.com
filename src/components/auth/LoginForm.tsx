import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");

  const API_URL = "http://localhost:8080/api/auth";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const userData = await response.json();

      // Store auth data in localStorage
      localStorage.setItem("authUser", JSON.stringify(userData));

      toast.success("Login successful!");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerEmail || !registerPassword || !registerConfirm) {
      toast.error("Please fill in all fields");
      return;
    }

    if (registerPassword !== registerConfirm) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          name: "User", // Set a default name, to be updated later
          mobile: "0000000000", // Set a default mobile, to be updated later
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      setIsLoading(false);
      toast.success("Registration successful! Please log in.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-casino-dark">
        <TabsTrigger
          value="login"
          className="data-[state=active]:bg-casino-primary"
        >
          Login
        </TabsTrigger>
        <TabsTrigger
          value="register"
          className="data-[state=active]:bg-casino-primary"
        >
          Register
        </TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="mt-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="bg-casino-darker border-casino-primary/30"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">Password</Label>
              <a
                href="#"
                className="text-xs text-casino-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="login-password"
              type="password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="bg-casino-darker border-casino-primary/30"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-casino-primary hover:bg-casino-secondary"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="register" className="mt-4">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              required
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              className="bg-casino-darker border-casino-primary/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input
              id="register-password"
              type="password"
              required
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              className="bg-casino-darker border-casino-primary/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-confirm">Confirm Password</Label>
            <Input
              id="register-confirm"
              type="password"
              required
              value={registerConfirm}
              onChange={(e) => setRegisterConfirm(e.target.value)}
              className="bg-casino-darker border-casino-primary/30"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-casino-primary hover:bg-casino-secondary"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
