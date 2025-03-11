import { ThemeProvider } from "@/components/theme-provider"
import ModeToggle from "@/components/togglemode"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { SocketProvider } from "./context/SocketContext"

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <SocketProvider>
            <Toaster />
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
            >
              {children}
              <ModeToggle />
            </ThemeProvider>
          </SocketProvider>
        </body>
      </html>
    </>
  )
}
