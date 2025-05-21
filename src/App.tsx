import { AppRoutes } from "@/routes/routes"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { useEffect } from "react"

function App() {
  // Force dark theme on load
  useEffect(() => {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="rophim-theme">
      <div className="min-h-screen bg-background">
        <AppRoutes />
      </div>
    </ThemeProvider>
  )
}

export default App