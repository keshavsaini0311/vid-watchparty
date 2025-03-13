"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export default function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="fixed top-4 right-16 z-40">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/80 transition-colors"
      >
        {theme === 'dark' ? (
          <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem] text-gray-700" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}
