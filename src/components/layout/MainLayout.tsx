import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();

  // Scroll to top when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check if the current page is the HomePage
  const isHomePage = location.pathname === "/home-page";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <ScrollArea className={`flex-1 ${isHomePage ? '-mt-22' : ''}`}>
        <main className="container mx-auto px-4 py-6 flex-1">
          <Outlet />
        </main>
      </ScrollArea>
      <Footer />
    </div>
  );
} 