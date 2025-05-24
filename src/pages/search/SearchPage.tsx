import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getMovieList } from "@/service/function";
import type { Movie } from "@/types/movie";
import { MovieCard } from "@/components/ui/movie-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MovieListParams } from "@/types/api";
import LoadingAnimation from "@/components/common/loading_animation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [yearInput, setYearInput] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<"single" | "series" | "all">("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalMovies, setTotalMovies] = useState<number>(0);
  const [jumpToPage, setJumpToPage] = useState<string>("");
  const moviesPerPage = 10;

  // Available categories
  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "hanh-dong", name: "Hành Động" },
    { id: "tinh-cam", name: "Tình Cảm" },
    { id: "hai-huoc", name: "Hài Hước" },
    { id: "co-trang", name: "Cổ Trang" },
    { id: "tam-ly", name: "Tâm Lý" },
    { id: "kinh-di", name: "Kinh Dị" },
    { id: "vien-tuong", name: "Viễn Tưởng" },
    { id: "phieu-luu", name: "Phiêu Lưu" },
    { id: "hinh-su", name: "Hình Sự" },
    { id: "hoat-hinh", name: "Hoạt Hình" },
    { id: "vo-thuat", name: "Võ Thuật" },
    { id: "than-thoai", name: "Thần Thoại" },
    { id: "chien-tranh", name: "Chiến Tranh" },
    { id: "bi-an", name: "Bí Ẩn" }
  ];

  // Available countries
  const countries = [
    { id: "all", name: "Tất cả" },
    { id: "viet-nam", name: "Việt Nam" },
    { id: "trung-quoc", name: "Trung Quốc" },
    { id: "han-quoc", name: "Hàn Quốc" },
    { id: "nhat-ban", name: "Nhật Bản" },
    { id: "au-my", name: "Âu Mỹ" },
    { id: "thai-lan", name: "Thái Lan" },
    { id: "an-do", name: "Ấn Độ" },
    { id: "philippines", name: "Philippines" },
    { id: "dai-loan", name: "Đài Loan" },
    { id: "hong-kong", name: "Hồng Kông" }
  ];

  // Available types
  const types = [
    { id: "all", name: "Tất cả" },
    { id: "single", name: "Phim lẻ" },
    { id: "series", name: "Phim bộ" }
  ];

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      fetchMovies(query);
    }
  }, [searchParams, currentPage, selectedCategory, yearInput, selectedCountry, selectedType]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, yearInput, selectedCountry, selectedType, searchQuery]);

  const fetchMovies = async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare API parameters
      const params: MovieListParams = {
        page: currentPage,
        limit: moviesPerPage,
        search: query,
        sort: 'latest', // Default sort by latest
      };

      // Add category filter if selected
      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }

      // Add year filter if entered
      if (yearInput && !isNaN(Number(yearInput))) {
        params.year = parseInt(yearInput);
      }

      // Add country filter if selected
      if (selectedCountry !== "all") {
        params.country = selectedCountry;
      }

      // Add type filter if selected
      if (selectedType !== "all") {
        params.type = selectedType as "single" | "series";
      }

      const response = await getMovieList(params);
      
      if (response.success && response.data) {
        setMovies(response.data.movies as Movie[]);
        setTotalMovies(response.data.pagination.total);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        throw new Error(response.message || "Không thể tải dữ liệu phim");
      }
    } catch (err) {
      console.error("Lỗi khi tìm kiếm phim:", err);
      setError("Có lỗi xảy ra khi tìm kiếm phim");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      fetchMovies(searchQuery);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = Number(jumpToPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
      setJumpToPage("");
    }
  };

  const handleYearInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and limit to 4 digits
    if (value === '' || (/^\d+$/.test(value) && value.length <= 4)) {
      setYearInput(value);
    }
  };

  const handleYearInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = searchParams.get("q");
      if (query) {
        fetchMovies(query);
      }
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Tìm kiếm phim</h1>
        <p className="text-muted-foreground">
          Tìm kiếm phim lẻ, phim bộ theo tên phim, diễn viên, đạo diễn...
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <Input
          type="search"
          placeholder="Nhập từ khóa tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          <Search className="mr-2 h-4 w-4" />
          Tìm kiếm
        </Button>
      </form>

      {searchParams.get("q") && (
        <>
          <div className="mb-6 flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <Select
                value={selectedType}
                onValueChange={(value: "single" | "series" | "all") => setSelectedType(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Loại phim" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Thể loại" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center border rounded-md w-[100px]">
                <Input
                  type="text"
                  value={yearInput}
                  onChange={handleYearInputChange}
                  onKeyDown={handleYearInputKeyDown}
                  placeholder="Năm..."
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              
              <Select
                value={selectedCountry}
                onValueChange={setSelectedCountry}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Quốc gia" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

      <Separator className="my-6" />
        </>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <LoadingAnimation />
        </div>
      ) : error ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="mb-4">
            <p className="text-muted-foreground">
              Tìm thấy {totalMovies} kết quả cho "{searchParams.get("q")}"
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-8 flex flex-col items-center space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageToShow;
                  if (totalPages <= 5) {
                    pageToShow = i + 1;
                  } else if (currentPage <= 3) {
                    pageToShow = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageToShow = totalPages - 4 + i;
                  } else {
                    pageToShow = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageToShow}
                      variant={currentPage === pageToShow ? "default" : "outline"}
                      size="icon"
                      onClick={() => handlePageChange(pageToShow)}
                    >
                      {pageToShow}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Jump to page form */}
              <div className="flex items-center ml-4 border rounded-md overflow-hidden">
                <Input
                  type="number"
                  value={jumpToPage}
                  onChange={(e) => setJumpToPage(e.target.value)}
                  placeholder="Đến trang..."
                  className="border-0 w-24 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                  min={1}
                  max={totalPages}
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 px-2" 
                  onClick={handleJumpToPage}
                  disabled={!jumpToPage}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Total results */}
            <div className="text-center text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages} • Tổng {totalMovies} phim
          </div>
        </div>
        </>
      ) : searchParams.get("q") ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg font-medium mb-2">Không tìm thấy kết quả nào</p>
          <p className="text-muted-foreground text-center max-w-md">
            Không tìm thấy kết quả nào cho "{searchParams.get("q")}". Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg font-medium mb-2">Tìm kiếm phim yêu thích</p>
          <p className="text-muted-foreground text-center max-w-md">
            Nhập từ khóa vào ô tìm kiếm để bắt đầu. Bạn có thể tìm kiếm theo tên phim, tên diễn viên, đạo diễn...
          </p>
        </div>
      )}
    </div>
  );
} 