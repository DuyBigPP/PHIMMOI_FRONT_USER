import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MovieCard } from "@/components/ui/movie-card";
import type { Movie } from "@/types/movie";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { getMovieList } from "@/service/function";
import { MovieListParams } from "@/types/api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingAnimation from "@/components/common/loading_animation";

// Genre categories with slugs
const genres = [
  { id: "hanh-dong", name: "Hành Động" },
  { id: "tinh-cam", name: "Tình Cảm" },
  { id: "hai-huoc", name: "Hài Hước" },
  { id: "kinh-di", name: "Kinh Dị" },
  { id: "co-trang", name: "Cổ Trang" },
  { id: "vien-tuong", name: "Viễn Tưởng" },
  { id: "tam-ly", name: "Tâm Lý" },
  { id: "hoat-hinh", name: "Hoạt Hình" },
  { id: "vo-thuat", name: "Võ Thuật" },
  { id: "phieu-luu", name: "Phiêu Lưu" },
  { id: "hinh-su", name: "Hình Sự" },
  { id: "chien-tranh", name: "Chiến Tranh" },
  { id: "tai-lieu", name: "Tài Liệu" },
  { id: "than-thoai", name: "Thần Thoại" },
  { id: "bi-an", name: "Bí Ẩn" },
  { id: "phim-18", name: "Phim 18+" },
  { id: "hoc-duong", name: "Học Đường" },
  { id: "chuong-trinh-truyen-hinh", name: "Chương Trình Truyền Hình" },
  { id: "gia-dinh", name: "Gia Đình" },
  { id: "gay-can", name: "Gay Cấn" },
  { id: "am-nhac", name: "Âm Nhạc" },
  { id: "gia-tuong", name: "Giả Tưởng" },
  { id: "lich-su", name: "Lịch Sử" },
  { id: "tre-em", name: "Trẻ Em" },
  { id: "mien-tay", name: "Miền Tây" },
  { id: "kinh-dien", name: "Kinh Điển" },
  { id: "the-thao", name: "Thể Thao" },
  { id: "chinh-kich", name: "Chính Kịch" },
  { id: "khoa-hoc", name: "Khoa Học" }
];

export default function GenrePage() {
  const { genreId } = useParams<{ genreId: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [yearInput, setYearInput] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [currentGenre, setCurrentGenre] = useState<{id: string, name: string} | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalMovies, setTotalMovies] = useState<number>(0);
  const [jumpToPage, setJumpToPage] = useState<string>("");
  const moviesPerPage = 10;

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

  // Movie types
  const types = [
    { id: "all", name: "Tất cả" },
    { id: "single", name: "Phim lẻ" },
    { id: "series", name: "Phim bộ" },
  ];

  // Find current genre when genreId changes
  useEffect(() => {
    if (genreId) {
      const genre = genres.find(g => g.id === genreId);
      setCurrentGenre(genre || null);
      setCurrentPage(1); // Reset to page 1 when genre changes
    }
  }, [genreId]);

  const fetchMovies = async () => {
    if (!genreId) return;

    try {
      setLoading(true);
      setError(null);

      // Prepare API parameters
      const params: MovieListParams = {
        page: currentPage,
        limit: moviesPerPage,
        category: genreId,
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

      // Add country filter if selected
      if (selectedCountry !== "all") {
        params.country = selectedCountry;
      }

      console.log("Fetching movies with params:", params);
      const response = await getMovieList(params);

      if (!response.success) {
        throw new Error(response.message || `Failed to fetch ${currentGenre?.name || ''} movies`);
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
    if (currentGenre) {
      fetchMovies();
    }
  }, [currentPage, genreId, selectedType, yearInput, selectedCountry, currentGenre]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, yearInput, selectedCountry]);

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

  if (!currentGenre) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-2">Thể loại không tồn tại</h1>
        <p className="text-muted-foreground">
          Thể loại bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Phim {currentGenre.name}</h1>
        <p className="text-muted-foreground">
          Danh sách phim thể loại {currentGenre.name} hay nhất, mới nhất
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
      
      {/* Loading state */}
      {loading && (
        <div className="flex h-40 items-center justify-center">
          <LoadingAnimation />
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