import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MovieCard } from "@/components/ui/movie-card";
import type { Movie } from "@/types/movie";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { getMovieList } from "@/service/function";
import { MovieListParams } from "@/types/api";
import { Input } from "@/components/ui/input";

// Map of country IDs to display names
const countries = [
  { id: "viet-nam", name: "Việt Nam" },
  { id: "han-quoc", name: "Hàn Quốc" },
  { id: "trung-quoc", name: "Trung Quốc" },
  { id: "nhat-ban", name: "Nhật Bản" },
  { id: "thai-lan", name: "Thái Lan" },
  { id: "au-my", name: "Âu Mỹ" },
  { id: "an-do", name: "Ấn Độ" },
  { id: "philippines", name: "Philippines" },
  { id: "dai-loan", name: "Đài Loan" },
  { id: "hong-kong", name: "Hồng Kông" },
];

export default function CountryPage() {
  const { countryId } = useParams<{ countryId: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [yearInput, setYearInput] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentCountry, setCurrentCountry] = useState<{id: string, name: string} | null>(null);
  
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
  ];

  // Movie types
  const types = [
    { id: "all", name: "Tất cả" },
    { id: "single", name: "Phim lẻ" },
    { id: "series", name: "Phim bộ" },
  ];

  // Find current country when countryId changes
  useEffect(() => {
    if (countryId) {
      const country = countries.find(c => c.id === countryId);
      setCurrentCountry(country || null);
      setCurrentPage(1); // Reset to page 1 when country changes
    }
  }, [countryId]);

  const fetchMovies = async () => {
    if (!countryId) return;

    try {
      setLoading(true);
      setError(null);

      // Prepare API parameters
      const params: MovieListParams = {
        page: currentPage,
        limit: moviesPerPage,
        country: countryId,
        sort: 'latest', // Default sort by latest
      };

      // Add type filter if selected
      if (selectedType !== "all") {
        params.type = selectedType as 'single' | 'series';
      }

      // Add year filter if entered
      if (yearInput && !isNaN(Number(yearInput))) {
        params.year = parseInt(yearInput);
      }

      // Add category filter if selected
      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }

      console.log("Fetching movies with params:", params);
      const response = await getMovieList(params);

      if (!response.success) {
        throw new Error(response.message || `Failed to fetch ${currentCountry?.name || ''} movies`);
      }

      const moviesData = [...response.data.movies] as Movie[];
      
      setMovies(moviesData);
      setTotalMovies(response.data.pagination.total);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError(err instanceof Error ? err.message : "Failed to load movies");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch movies when filters or pagination changes
  useEffect(() => {
    if (currentCountry) {
      fetchMovies();
    }
  }, [currentPage, countryId, selectedType, yearInput, selectedCategory, currentCountry]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, yearInput, selectedCategory]);

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
      fetchMovies();
    }
  };

  if (!currentCountry) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-2">Quốc gia không tồn tại</h1>
        <p className="text-muted-foreground">
          Quốc gia bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Phim {currentCountry.name}</h1>
        <p className="text-muted-foreground">
          Danh sách phim {currentCountry.name} hay nhất, mới nhất
        </p>
      </div>
      
      <div className="mb-6 flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
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
        </div>
      </div>
      
      <Separator className="my-6" />
      
      {/* Loading state */}
      {loading && (
        <div className="flex h-40 items-center justify-center">
          <p className="text-muted-foreground">Đang tải phim...</p>
        </div>
      )}
      
      {/* Error state */}
      {!loading && error && (
        <div className="flex h-40 items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && !error && movies.length === 0 && (
        <div className="flex h-40 items-center justify-center">
          <p className="text-muted-foreground">Không tìm thấy phim nào phù hợp với bộ lọc.</p>
        </div>
      )}
      
      {/* Movies grid */}
      {!loading && !error && movies.length > 0 && (
        <>
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
      )}
    </div>
  );
} 