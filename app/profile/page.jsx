"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";
import { Loader2, User } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/me");
        
          const userData = await response.json();
          if(userData.success){
            setUser(userData.user);
            setProfileData({
              username: userData.user.username || "",
              email: userData.user.email || "",
            });
          }else{
            toast.error("Failed to fetch profile");
            router.push("/auth");
          }
        
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Session expired. Please login again.");
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await axios.put("/api/users/update", profileData);
      if (response.data.success) {
        setUser(response.data.user);
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.error || "An error occurred while updating profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      if (response.data.success) {
        toast.success("Logged out successfully");
        router.push("/auth");
      } else {
        toast.error(response.data.error || "Failed to logout");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("An error occurred while logging out");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-black">
      <Navbar />
      <div className="container mx-auto py-24 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
        
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <Card className="h-fit">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage 
                  src={user?.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.username || "User")} 
                  alt={user?.username || "User"} 
                />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{user?.username}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    placeholder="Your username"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    placeholder="Your email"
                    autoComplete="off"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

