import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "@/lib/mock-data";
import type { Movie } from "@/types/movie";
import { MovieCard } from "@/components/ui/movie-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setIsSearching(true);
    
    // Simulating API call with delay
    setTimeout(() => {
      const searchResults = searchMovies(query);
      setResults(searchResults);
      setIsSearching(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      handleSearch(searchQuery);
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
        <Button type="submit" disabled={isSearching}>
          <Search className="mr-2 h-4 w-4" />
          Tìm kiếm
        </Button>
      </form>

      <Separator className="my-6" />

      {isSearching ? (
        <div className="flex items-center justify-center h-64">
          <p>Đang tìm kiếm...</p>
        </div>
      ) : results.length > 0 ? (
        <div>
          <div className="mb-4">
            <p className="text-muted-foreground">
              Tìm thấy {results.length} kết quả cho "{searchParams.get("q")}"
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      ) : searchParams.get("q") ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg font-medium mb-2">Không tìm thấy kết quả nào</p>
          <p className="text-muted-foreground text-center max-w-md">
            Không tìm thấy kết quả nào cho "{searchParams.get("q")}". Vui lòng thử lại với từ khóa khác.
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