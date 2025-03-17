"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, Users } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  const handleClick = () => {
    if (!roomId.trim()) return;
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-black">
      <Navbar />
      <div className="container mx-auto max-w-4xl py-24 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">
            Watch Together
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Create or join a watch party to enjoy videos with friends
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Join Room Card */}
          <Card className="p-8 bg-white/90 dark:bg-black/90 backdrop-blur-sm border-gray-200 dark:border-gray-800 shadow-xl">
            <div className="flex flex-col items-center gap-6">
              <div className="p-4 rounded-full bg-primary/10 dark:bg-primary/20">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Join Room</h2>
              <div className="w-full space-y-4">
                <input
                  onChange={(e) => setRoomId(e.target.value)}
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/30 transition-all"
                  placeholder="Enter Room ID"
                  autoComplete="off"
                />
                <Button
                  onClick={handleClick}
                  className="relative w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden group/btn"
                >
                  <span className="relative z-10">Join WatchParty</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </div>
            </div>
          </Card>

          {/* Create Room Card */}
          <Card className="p-8 bg-white/90 dark:bg-black/90 backdrop-blur-sm border-gray-200 dark:border-gray-800 shadow-xl">
            <div className="flex flex-col items-center gap-6">
              <div className="p-4 rounded-full bg-primary/10 dark:bg-primary/20">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Create Room</h2>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Start a new watch party and invite your friends
              </p>
              <Link href="/room" className="w-full">
                <Button className="relative w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden group/btn">
                  <span className="relative z-10">Create WatchParty</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
