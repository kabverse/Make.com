
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ProfileData {
  name: string;
  email: string;
  mobile: string;
  aadhaar: string;
}

interface ProfileFormProps {
  initialData?: ProfileData;
  onSuccess?: () => void;
}

export default function ProfileForm({ initialData, onSuccess }: ProfileFormProps) {
  const [name, setName] = useState(initialData?.name || "John Doe");
  const [email, setEmail] = useState(initialData?.email || "john.doe@example.com");
  const [mobile, setMobile] = useState(initialData?.mobile || "9876543210");
  const [aadhaar, setAadhaar] = useState(initialData?.aadhaar || "123456789012");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setMobile(initialData.mobile);
      setAadhaar(initialData.aadhaar);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !mobile) {
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
    
    // In a real app, this would call the Spring Boot backend
    // For now, we'll update localStorage
    
    // API endpoint would be something like:
    // fetch('http://your-spring-boot-api/api/user/profile', {
    //   method: 'PUT',
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${userData.token}`
    //   },
    //   body: JSON.stringify({ name, email, mobile, aadhaar })
    // })
    
    // Update user data in localStorage
    const authUserString = localStorage.getItem("authUser");
    if (authUserString) {
      try {
        const userData = JSON.parse(authUserString);
        const updatedUserData = {
          ...userData,
          name,
          email,
          mobile,
          aadhaar
        };
        localStorage.setItem("authUser", JSON.stringify(updatedUserData));
      } catch (error) {
        console.error("Failed to update user data", error);
      }
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
      if (onSuccess) onSuccess();
    }, 1000);
  };

  return (
    <div className="space-y-4 mt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
            className="bg-casino-darker border-casino-primary/30"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
            className="bg-casino-darker border-casino-primary/30"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input
            id="mobile"
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            disabled={!isEditing}
            className="bg-casino-darker border-casino-primary/30"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="aadhaar">Aadhaar Number</Label>
          <Input
            id="aadhaar"
            type="text"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
            disabled={!isEditing}
            className="bg-casino-darker border-casino-primary/30"
          />
        </div>
        
        {isEditing ? (
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline"
              className="border-casino-primary/30 text-white"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-casino-primary hover:bg-casino-secondary"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        ) : (
          <Button 
            type="button" 
            className="w-full bg-casino-primary hover:bg-casino-secondary"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </form>
      
      {!isEditing && (
        <div className="pt-4 border-t border-casino-primary/20">
          <Button 
            type="button" 
            variant="outline"
            className="w-full border-red-600/30 text-red-500 hover:bg-red-800/20"
          >
            Change Password
          </Button>
        </div>
      )}
    </div>
  );
}
