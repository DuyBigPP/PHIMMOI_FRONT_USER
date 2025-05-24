import { AppRoutes } from "@/routes/routes"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { AuthProvider } from "@/context/AuthContext"
import { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"

function App() {
  // Force dark theme on load
  useEffect(() => {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="rophim-theme">
          <div className="min-h-screen bg-background">
            <AppRoutes />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App