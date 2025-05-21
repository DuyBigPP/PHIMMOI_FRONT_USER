import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-black text-white" : "bg-transparent text-white"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="w-full px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/home-page" className="flex items-center space-x-2">
              <span className="text-2xl font-bold transition-colors text-white">PHIMSKIBIDI</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/phim-le" className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors bg-transparent hover:bg-white/10 focus:bg-white/20"
                      )}>
                        Phim Lẻ
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/phim-bo" className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors bg-transparent hover:bg-white/10 focus:bg-white/20"
                      )}>
                        Phim Bộ
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn(
                      "bg-transparent text-white hover:bg-white/10 data-[state=open]:bg-white/20"
                    )}>Thể Loại</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] grid-cols-2 gap-3 p-4">
                        <Link to="/the-loai/hanh-dong" className="block p-2 hover:bg-accent rounded-md">Hành Động</Link>
                        <Link to="/the-loai/tinh-cam" className="block p-2 hover:bg-accent rounded-md">Tình Cảm</Link>
                        <Link to="/the-loai/kinh-di" className="block p-2 hover:bg-accent rounded-md">Kinh Dị</Link>
                        <Link to="/the-loai/hai-huoc" className="block p-2 hover:bg-accent rounded-md">Hài Hước</Link>
                        <Link to="/the-loai/co-trang" className="block p-2 hover:bg-accent rounded-md">Cổ Trang</Link>
                        <Link to="/the-loai/vien-tuong" className="block p-2 hover:bg-accent rounded-md">Viễn Tưởng</Link>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn(
                      "bg-transparent text-white hover:bg-white/10 data-[state=open]:bg-white/20"
                    )}>Quốc Gia</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] grid-cols-2 gap-3 p-4">
                        <Link to="/quoc-gia/viet-nam" className="block p-2 hover:bg-accent rounded-md">Việt Nam</Link>
                        <Link to="/quoc-gia/han-quoc" className="block p-2 hover:bg-accent rounded-md">Hàn Quốc</Link>
                        <Link to="/quoc-gia/trung-quoc" className="block p-2 hover:bg-accent rounded-md">Trung Quốc</Link>
                        <Link to="/quoc-gia/thai-lan" className="block p-2 hover:bg-accent rounded-md">Thái Lan</Link>
                        <Link to="/quoc-gia/nhat-ban" className="block p-2 hover:bg-accent rounded-md">Nhật Bản</Link>
                        <Link to="/quoc-gia/au-my" className="block p-2 hover:bg-accent rounded-md">Âu Mỹ</Link>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Search and Theme Toggle */}
            <div className="flex items-center space-x-2">
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <Input
                  type="search"
                  placeholder="Tìm kiếm phim..."
                  className={cn(
                    "w-[200px] lg:w-[300px] transition-all bg-transparent border-white/20 text-white placeholder:text-white/70"
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className={cn(
                    "absolute right-0 top-0 h-full text-white hover:text-white hover:bg-white/10"
                  )}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "md:hidden text-white hover:text-white hover:bg-white/10"
                )}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <form onSubmit={handleSearch} className="relative mb-4">
                <Input
                  type="search"
                  placeholder="Tìm kiếm phim..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <nav className="flex flex-col space-y-2">
                <Link to="/phim-le" className="px-2 py-2 hover:bg-accent rounded-md" onClick={() => setMobileMenuOpen(false)}>
                  Phim Lẻ
                </Link>
                <Link to="/phim-bo" className="px-2 py-2 hover:bg-accent rounded-md" onClick={() => setMobileMenuOpen(false)}>
                  Phim Bộ
                </Link>
                <div className="px-2 py-2">
                  <h3 className="font-medium mb-2">Thể Loại</h3>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    <Link to="/the-loai/hanh-dong" className="py-1 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Hành Động</Link>
                    <Link to="/the-loai/tinh-cam" className="py-1 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Tình Cảm</Link>
                    <Link to="/the-loai/kinh-di" className="py-1 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Kinh Dị</Link>
                    <Link to="/the-loai/hai-huoc" className="py-1 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Hài Hước</Link>
                  </div>
                </div>
                <div className="px-2 py-2">
                  <h3 className="font-medium mb-2">Quốc Gia</h3>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    <Link to="/quoc-gia/viet-nam" className="py-1 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Việt Nam</Link>
                    <Link to="/quoc-gia/han-quoc" className="py-1 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Hàn Quốc</Link>
                    <Link to="/quoc-gia/trung-quoc" className="py-1 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Trung Quốc</Link>
                    <Link to="/quoc-gia/au-my" className="py-1 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Âu Mỹ</Link>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}