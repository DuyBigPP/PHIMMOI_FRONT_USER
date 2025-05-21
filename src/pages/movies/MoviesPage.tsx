import { useState, useEffect } from "react";
import { MovieCard } from "@/components/ui/movie-card";
import { mockMovies } from "@/lib/mock-data";
import type { Movie } from "@/types/movie";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("latest");

  useEffect(() => {
    // Get only movies (not TV shows)
    const moviesOnly = mockMovies.filter(movie => movie.type === 'movie');
    setMovies(moviesOnly);
    setFilteredMovies(moviesOnly);
  }, []);

  useEffect(() => {
    let result = [...movies];
    
    // Filter by genre
    if (selectedGenre !== "all") {
      result = result.filter(movie => 
        movie.genres.some(genre => genre.id === selectedGenre)
      );
    }
    
    // Filter by year
    if (selectedYear !== "all") {
      result = result.filter(movie => {
        const year = new Date(movie.releaseDate).getFullYear().toString();
        return year === selectedYear;
      });
    }
    
    // Sort results
    switch (selectedSort) {
      case "latest":
        result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    setFilteredMovies(result);
  }, [movies, selectedGenre, selectedYear, selectedSort]);

  // Get unique years from movies for the filter
  const years = [...new Set(movies.map(movie => 
    new Date(movie.releaseDate).getFullYear().toString()
  ))].sort((a, b) => Number(b) - Number(a));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Phim Lẻ</h1>
        <p className="text-muted-foreground">
          Danh sách phim lẻ mới nhất, chất lượng cao, vietsub, thuyết minh
        </p>
      </div>
      
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <Tabs defaultValue="all" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger 
              value="all" 
              onClick={() => setSelectedGenre("all")}
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger 
              value="action" 
              onClick={() => setSelectedGenre("action")}
            >
              Hành Động
            </TabsTrigger>
            <TabsTrigger 
              value="romance" 
              onClick={() => setSelectedGenre("romance")}
            >
              Tình Cảm
            </TabsTrigger>
            <TabsTrigger 
              value="comedy" 
              onClick={() => setSelectedGenre("comedy")}
            >
              Hài Hước
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center space-x-2">
          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedSort}
            onValueChange={setSelectedSort}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
              <SelectItem value="rating">Xếp hạng</SelectItem>
              <SelectItem value="name">Tên A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      {filteredMovies.length === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-muted-foreground">Không tìm thấy phim nào phù hợp với bộ lọc.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
} 