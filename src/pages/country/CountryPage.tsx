import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMoviesByCountry } from "@/lib/mock-data";
import type { Movie } from "@/types/movie";
import { MovieCard } from "@/components/ui/movie-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Map of country IDs to display names
const countryMap: Record<string, string> = {
  "viet-nam": "Việt Nam",
  "han-quoc": "Hàn Quốc",
  "trung-quoc": "Trung Quốc",
  "nhat-ban": "Nhật Bản",
  "thai-lan": "Thái Lan",
  "au-my": "Âu Mỹ",
};

export default function CountryPage() {
  const { countryId } = useParams<{ countryId: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("latest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (countryId) {
      setLoading(true);
      
      // Get country name from map
      const countryName = countryMap[countryId];
      
      if (countryName) {
        // Get movies by country
        const moviesByCountry = getMoviesByCountry(countryName);
        setMovies(moviesByCountry);
      } else {
        setMovies([]);
      }
      
      setLoading(false);
    }
  }, [countryId]);

  // Filter and sort movies when these values change
  useEffect(() => {
    let result = [...movies];
    
    // Filter by type (movie or tv)
    if (selectedType !== "all") {
      result = result.filter(item => item.type === selectedType);
    }
    
    // Sort results
    result = sortMovies(result, selectedSort);
    
    setFilteredMovies(result);
  }, [movies, selectedType, selectedSort]);

  const sortMovies = (movieList: Movie[], sortOption: string): Movie[] => {
    const sorted = [...movieList];
    
    switch (sortOption) {
      case "latest":
        return sorted.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
      case "oldest":
        return sorted.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "name":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  // Get country name for display
  const countryName = countryId ? countryMap[countryId] : null;

  if (!countryName) {
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
        <h1 className="text-3xl font-bold mb-2">Phim {countryName}</h1>
        <p className="text-muted-foreground">
          Danh sách phim {countryName} hay nhất, mới nhất
        </p>
      </div>

      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <Tabs 
          defaultValue="all" 
          value={selectedType}
          onValueChange={setSelectedType}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="movie">Phim lẻ</TabsTrigger>
            <TabsTrigger value="tv">Phim bộ</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Select
          value={selectedSort}
          onValueChange={setSelectedSort}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Mới nhất</SelectItem>
            <SelectItem value="oldest">Cũ nhất</SelectItem>
            <SelectItem value="rating">Xếp hạng</SelectItem>
            <SelectItem value="name">Tên A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-6" />

      {filteredMovies.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Không tìm thấy phim nào từ quốc gia này.</p>
        </div>
      ) : (
        <div>
          <p className="mb-4">Tìm thấy {filteredMovies.length} phim</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 