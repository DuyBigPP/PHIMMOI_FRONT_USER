import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Genre categories with slugs
const genres = [
  { name: "Hành Động", slug: "hanh-dong" },
  { name: "Tình Cảm", slug: "tinh-cam" },
  { name: "Hài Hước", slug: "hai-huoc" },
  { name: "Kinh Dị", slug: "kinh-di" },
  { name: "Cổ Trang", slug: "co-trang" },
  { name: "Viễn Tưởng", slug: "vien-tuong" },
  { name: "Tâm Lý", slug: "tam-ly" },
  { name: "Hoạt Hình", slug: "hoat-hinh" },
  { name: "Võ Thuật", slug: "vo-thuat" },
  { name: "Phiêu Lưu", slug: "phieu-luu" },
  { name: "Hình Sự", slug: "hinh-su" },
  { name: "Chiến Tranh", slug: "chien-tranh" },
  { name: "Tài Liệu", slug: "tai-lieu" },
  { name: "Thần Thoại", slug: "than-thoai" },
  { name: "Bí Ẩn", slug: "bi-an" },
  { name: "Phim 18+", slug: "phim-18" },
  { name: "Học Đường", slug: "hoc-duong" },
  { name: "Chương Trình Truyền Hình", slug: "chuong-trinh-truyen-hinh" },
  { name: "Gia Đình", slug: "gia-dinh" },
  { name: "Gay Cấn", slug: "gay-can" },
  { name: "Âm Nhạc", slug: "am-nhac" },
  { name: "Giả Tưởng", slug: "gia-tuong" },
  { name: "Lịch Sử", slug: "lich-su" },
  { name: "Trẻ Em", slug: "tre-em" },
  { name: "Miền Tây", slug: "mien-tay" },
  { name: "Kinh Điển", slug: "kinh-dien" },
  { name: "Thể Thao", slug: "the-thao" },
  { name: "Chính Kịch", slug: "chinh-kich" },
  { name: "Khoa Học", slug: "khoa-hoc" }
];

// Country list with slugs
const countries = [
  { name: "Việt Nam", slug: "viet-nam" },
  { name: "Hàn Quốc", slug: "han-quoc" },
  { name: "Trung Quốc", slug: "trung-quoc" },
  { name: "Thái Lan", slug: "thai-lan" },
  { name: "Nhật Bản", slug: "nhat-ban" },
  { name: "Âu Mỹ", slug: "au-my" },
  { name: "Ấn Độ", slug: "an-do" },
  { name: "Philippines", slug: "philippines" },
  { name: "Đài Loan", slug: "dai-loan" },
  { name: "Hồng Kông", slug: "hong-kong" },
];

export function Header() {
  console.log('Header component initialized');
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  
  // Always call hooks at the top level
  const auth = useAuth();
  console.log('Auth accessed in Header:', auth ? 'loaded' : 'undefined');
  const { user, logout } = auth || { user: null, logout: () => {} };
  console.log('User in Header:', user ? 'exists' : 'null');

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

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/home-page");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    
    const names = user.name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-black text-white" : "bg-transparent text-white"
      )}
    >
      <div className="container mx-auto px-4">
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
                      <div className="grid w-[600px] grid-cols-3 gap-3 p-4">
                        {genres.map(genre => (
                          <Link 
                            key={genre.slug}
                            to={`/the-loai/${genre.slug}`} 
                            className="block p-2 hover:bg-accent rounded-md"
                          >
                            {genre.name}
                          </Link>
                        ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn(
                      "bg-transparent text-white hover:bg-white/10 data-[state=open]:bg-white/20"
                  )}>Quốc Gia</NavigationMenuTrigger>
                  <NavigationMenuContent>
                      <div className="grid w-[500px] grid-cols-2 gap-3 p-4">
                        {countries.map(country => (
                          <Link 
                            key={country.slug}
                            to={`/quoc-gia/${country.slug}`} 
                            className="block p-2 hover:bg-accent rounded-md"
                          >
                            {country.name}
                          </Link>
                        ))}
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

              {/* User Menu or Login/Register Button */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full h-9 w-9 ml-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/user-profile" className="cursor-pointer">
                        Hồ sơ của tôi
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden md:flex"
                  onClick={() => navigate("/dang-nhap")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Đăng nhập
                </Button>
              )}

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

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-black/50 md:hidden" 
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Mobile Menu */}
            <div className="fixed top-16 left-0 right-0 z-50 md:hidden bg-black/95 backdrop-blur-sm border-t border-white/20 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="container mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="relative mb-4">
                <Input
                  type="search"
                  placeholder="Tìm kiếm phim..."
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-full text-white hover:text-white hover:bg-white/10"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <nav className="flex flex-col space-y-2">
                {/* Auth buttons for mobile */}
                {user ? (
                  <div className="flex flex-col space-y-2 mb-2">
                    <Link 
                      to="/user-profile" 
                      className="flex items-center px-2 py-2 hover:bg-white/10 rounded-md text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span>Hồ sơ của tôi</span>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="justify-start border-white/20 text-white hover:bg-white/10"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Đăng xuất
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2 mb-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                      onClick={() => {
                        navigate("/dang-nhap");
                        setMobileMenuOpen(false);
                      }}
                    >
                      Đăng nhập
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        navigate("/dang-ky");
                        setMobileMenuOpen(false);
                      }}
                    >
                      Đăng ký
                    </Button>
                  </div>
                )}

                <Link to="/phim-le" className="px-2 py-2 hover:bg-white/10 rounded-md text-white" onClick={() => setMobileMenuOpen(false)}>
                  Phim Lẻ
                </Link>
                <Link to="/phim-bo" className="px-2 py-2 hover:bg-white/10 rounded-md text-white" onClick={() => setMobileMenuOpen(false)}>
                  Phim Bộ
                </Link>
                <div className="px-2 py-2">
                  <h3 className="font-medium mb-2 text-white">Thể Loại</h3>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                      {genres.slice(0, 8).map(genre => (
                        <Link 
                          key={genre.slug}
                          to={`/the-loai/${genre.slug}`} 
                          className="py-1 hover:text-primary text-white/80" 
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {genre.name}
                        </Link>
                      ))}
                  </div>
                </div>
                <div className="px-2 py-2">
                  <h3 className="font-medium mb-2 text-white">Quốc Gia</h3>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                      {countries.slice(0, 6).map(country => (
                        <Link 
                          key={country.slug}
                          to={`/quoc-gia/${country.slug}`} 
                          className="py-1 hover:text-primary text-white/80" 
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {country.name}
                        </Link>
                      ))}
                  </div>
                </div>
              </nav>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}