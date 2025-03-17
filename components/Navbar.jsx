"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Home, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Home button */}
          <Link href="/">
            <Button 
              variant="ghost" 
              size="icon"
              className={`h-10 w-10 rounded-full ${pathname === "/" ? "bg-accent" : ""}`}
            >
              <Home className="h-5 w-5" />
            </Button>
          </Link>

          {/* Right side - Profile and Theme toggle */}
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button 
                variant="ghost" 
                size="icon"
                className={`h-10 w-10 rounded-full ${pathname === "/profile" ? "bg-accent" : ""}`}
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-10 w-10 rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 