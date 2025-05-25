import { Separator } from "@/components/ui/separator";
import { MovieCarousel } from "@/components/ui/movie-carousel";
import { MovieSection } from "@/components/sections/MovieSection";
import type { Movie } from "@/types/movie";

interface RelatedMoviesProps {
  movies: Movie[];
}

export function RelatedMovies({ movies }: RelatedMoviesProps) {
  if (!movies || movies.length === 0) {
    return null;
  }
  
  return (
    <div>
      <Separator className="my-8" />
      
      {/* Desktop version */}
      <div className="hidden md:block">
        <h2 className="text-xl font-semibold mb-6">Phim liên quan</h2>
        <MovieCarousel movies={movies} />
      </div>
      
      {/* Mobile version */}
      <div className="md:hidden">
        <MovieSection 
          title="Phim liên quan" 
          movies={movies.slice(0, 6)}
        />
      </div>
    </div>
  );
} 