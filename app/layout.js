import { ThemeProvider } from "@/components/theme-provider"
import ModeToggle from "@/components/togglemode"
import "./globals.css"
import { Toaster } from "react-hot-toast"
export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <Toaster
            position="top-right"
            reverseOrder={false} 
          />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
          >
            {children}
            <ModeToggle />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
