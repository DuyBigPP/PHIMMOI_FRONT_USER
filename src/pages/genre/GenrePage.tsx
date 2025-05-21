import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMoviesByGenre, genres } from "@/lib/mock-data";
import type { Movie, Genre } from "@/types/movie";
import { MovieCard } from "@/components/ui/movie-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function GenrePage() {
  const { genreId } = useParams<{ genreId: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentGenre, setCurrentGenre] = useState<Genre | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>("latest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (genreId) {
      setLoading(true);
      
      // Find genre name
      const genre = genres.find((g) => g.id === genreId);
      setCurrentGenre(genre || null);
      
      // Get movies by genre
      const moviesByGenre = getMoviesByGenre(genreId);
      
      // Sort results
      const sortedMovies = sortMovies(moviesByGenre, selectedSort);
      setMovies(sortedMovies);
      
      setLoading(false);
    }
  }, [genreId]);

  useEffect(() => {
    // Resort movies when sort option changes
    setMovies(sortMovies(movies, selectedSort));
  }, [selectedSort]);

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

      <div className="flex justify-between items-center mb-6">
        <p>Tìm thấy {movies.length} phim</p>
        
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

      {movies.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Không tìm thấy phim nào trong thể loại này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
} 