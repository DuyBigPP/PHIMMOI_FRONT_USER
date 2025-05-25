import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getUserFavorite, getUserInfo, deleteFavorite } from "@/service/function";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieCard } from "@/components/ui/movie-card";
import { LogOut, User, Heart, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/types/movie";
import { User as UserType } from "@/types/api";
import LoadingAnimation from "@/components/common/loading_animation";

// Define a safer FavoriteItem type based on API response
interface FavoriteItem {
  id: string;
  userId: string;
  movieId: string;
  createdAt: string;
  movie: {
    id: string;
    name: string;
    slug: string;
    originName: string;
    type: string;
    poster?: string;
    posterUrl?: string;
    backdrop?: string;
    description?: string;
    year: number;
    duration?: number;
    rating?: number;
    categories?: Array<{
      category: {
        id: string;
        name: string;
        slug: string;
      }
    }>;
    countries?: Array<{
      country: {
        id: string;
        name: string;
        slug: string;
      }
    }>;
  };
}

// Wrapper type for API response format
interface FavoritesResponse {
  favorites: FavoriteItem[];
}

export function UserProfileContent() {
  console.log('UserProfileContent initialized');
  const auth = useAuth();
  console.log('Auth context in UserProfileContent:', auth ? 'loaded' : 'undefined');
  
  const { user: authUser, logout, isLoading: authLoading } = auth;
  console.log('User in UserProfileContent:', authUser ? 'exists' : 'null');
  
  const navigate = useNavigate();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserType | null>(null);
  const [isLoadingUserDetails, setIsLoadingUserDetails] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;

  // Ẩn thông báo lỗi sau 3 giây
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Lấy thông tin chi tiết của người dùng từ API
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!authUser) return;
      
      setIsLoadingUserDetails(true);
      try {
        console.log('Fetching detailed user info...');
        const response = await getUserInfo();
        console.log('User info API response type:', typeof response);
        
        if (response) {
          // Kiểm tra nếu response là ApiResponse
          if ('success' in response && 'data' in response && response.success && response.data) {
            console.log('Setting detailed user info from ApiResponse:', response.data);
            setUserDetails(response.data);
          } 
          // Nếu response là User object trực tiếp
          else if ('id' in response && 'email' in response) {
            console.log('Setting detailed user info from direct User object:', response);
            setUserDetails(response);
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setIsLoadingUserDetails(false);
      }
    };

    fetchUserDetails();
  }, [authUser]);

  // Lấy danh sách phim yêu thích
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!authUser) {
        console.log('No user, skipping fetchFavorites');
        return;
      }

      console.log('Fetching favorites for user:', authUser.id);
      setIsLoading(true);
      
      try {
        const response = await getUserFavorite();
        console.log('Favorites response:', response);
        
        if (response.success && response.data) {
          // Xử lý các định dạng API khác nhau
          let items: FavoriteItem[] = [];
          
          if (Array.isArray(response.data)) {
            console.log('API returned array directly:', response.data);
            items = response.data as FavoriteItem[];
          } else if (response.data.favorites && Array.isArray(response.data.favorites)) {
            console.log('API returned object with favorites array:', response.data.favorites);
            items = (response.data as unknown as FavoritesResponse).favorites;
          }
          
          // Lọc và chuyển đổi dữ liệu thành Movie[] để hiển thị
          const movies: Movie[] = items
            .filter(item => item.movie) // Đảm bảo có thông tin phim
            .map(item => {
              // Chuyển đổi đối tượng phim từ API sang Movie
              const movie = item.movie;
              return {
                id: movie.id,
                name: movie.name,
                slug: movie.slug,
                originName: movie.originName,
                type: movie.type,
                posterUrl: movie.posterUrl || movie.poster || '',
                poster: movie.poster || '',
                content: movie.description || '',
                year: movie.year,
                time: movie.duration ? `${movie.duration} phút` : '',
                quality: '',
                categories: movie.categories || [],
                countries: movie.countries || [],
                duration: movie.duration,
                rating: movie.rating,
                backdrop: movie.backdrop,
                description: movie.description,
              };
            });
          
          console.log('Parsed favorite movies:', movies.length);
          setFavoriteMovies(movies);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setErrorMessage("Không thể tải danh sách phim yêu thích");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [authUser]);

  const handleLogout = () => {
    console.log('Logout clicked in UserProfileContent');
    logout();
    navigate("/home-page");
  };

  // Hàm định dạng ngày tham gia an toàn
  const formatJoinDate = (dateString: string) => {
    try {
      // Kiểm tra nếu dateString có định dạng hợp lệ
      if (!dateString || dateString === "string" || dateString === "") {
        return "Không xác định";
      }
      
      // Phân tích ngày
      const date = new Date(dateString);
      
      // Kiểm tra nếu ngày hợp lệ
      if (isNaN(date.getTime())) {
        return "Không xác định";
      }
      
      // Format ngày theo locale Việt Nam
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit", 
        year: "numeric"
      });
    } catch (error) {
      console.error("Lỗi khi định dạng ngày:", error);
      return "Không xác định";
    }
  };

  // Hàm xóa phim yêu thích
  const handleRemoveFavorite = async (movieId: string) => {
    try {
      await deleteFavorite(movieId);
      // Cập nhật UI bằng cách xóa phim khỏi danh sách
      setFavoriteMovies(prevMovies => {
        const updatedMovies = prevMovies.filter(movie => movie.id !== movieId);
        
        // Check if the current page would be empty after deletion
        const newTotalPages = Math.ceil(updatedMovies.length / moviesPerPage);
        const currentPageItemCount = currentMovies.length;
        
        if (currentPageItemCount === 1 && currentPage > 1) {
          // If we're deleting the last item on this page (and not on first page)
          setCurrentPage(currentPage - 1);
        } else if (currentPage > newTotalPages) {
          // If current page no longer exists
          setCurrentPage(Math.max(newTotalPages, 1));
        }
        
        return updatedMovies;
      });
    } catch (error) {
      console.error("Error removing favorite:", error);
      setErrorMessage("Không thể xóa phim khỏi danh sách yêu thích");
    }
  };

  // Calculated pagination values
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = favoriteMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(favoriteMovies.length / moviesPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Render page numbers with ellipsis for many pages
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Complex logic for many pages
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Somewhere in the middle
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (authLoading || isLoadingUserDetails) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingAnimation />
      </div>
    );
  }

  if (!authUser) {
    console.log('No user, showing login prompt');
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Bạn chưa đăng nhập</h2>
        <Button onClick={() => navigate("/dang-nhap")}>Đăng nhập ngay</Button>
      </div>
    );
  }

  // Sử dụng thông tin chi tiết nếu có, nếu không thì dùng thông tin từ auth
  const displayUser = userDetails || authUser;
  
  console.log('Rendering UserProfileContent for user:', displayUser.name);
  console.log('User createdAt:', displayUser.createdAt);
  console.log('Full display user object:', displayUser);
  
  // Lấy ngày tham gia
  const joinDate = displayUser?.createdAt || 'Không xác định';
  console.log('Join date to format:', joinDate);
  
  return (
    <div className="container mx-auto py-4 px-4 sm:py-8">
      {errorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-red-500 text-white px-4 py-2 rounded-md text-sm z-50 animate-in fade-in duration-300">
          {errorMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-4">
        {/* User Info Card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center pb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <User className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              </div>
              <CardTitle className="text-lg sm:text-xl text-center">{displayUser.name}</CardTitle>
              <p className="text-sm text-muted-foreground text-center">{displayUser.email}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Ngày tham gia:</span>{" "}
                  {formatJoinDate(joinDate)}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <Tabs defaultValue="favorites">
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="favorites" className="flex-1 sm:flex-none">
                <Heart className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Phim yêu thích</span>
                <span className="sm:hidden">Yêu thích</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 sm:flex-none">
                <span className="hidden sm:inline">Cài đặt tài khoản</span>
                <span className="sm:hidden">Cài đặt</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="favorites">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingAnimation />
                </div>
              ) : favoriteMovies.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {currentMovies.map((movie) => (
                      <div key={movie.id} className="group relative">
                        <MovieCard movie={movie} />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 sm:w-8 sm:h-8"
                          onClick={() => handleRemoveFavorite(movie.id)}
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="sr-only">Xóa khỏi yêu thích</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center mt-8 space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Trang trước</span>
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {renderPageNumbers().map((pageNumber, index) => 
                          pageNumber === 'ellipsis' ? (
                            <span key={`ellipsis-${index}`} className="w-8 flex items-center justify-center">
                              ...
                            </span>
                          ) : (
                            <Button
                              key={pageNumber}
                              variant={pageNumber === currentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => paginate(pageNumber as number)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNumber}
                            </Button>
                          )
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Trang sau</span>
                      </Button>
                    </div>
                  )}
                  
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    Hiển thị {indexOfFirstMovie + 1}-{Math.min(indexOfLastMovie, favoriteMovies.length)} của {favoriteMovies.length} phim
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Chưa có phim yêu thích</h3>
                  <p className="text-muted-foreground mb-4">
                    Thêm phim vào danh sách yêu thích để xem lại sau
                  </p>
                  <Button onClick={() => navigate("/home-page")}>
                    Khám phá phim
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt tài khoản</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Tính năng này đang được phát triển.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 