import { Separator } from "@/components/ui/separator";
import { MovieCarousel } from "@/components/ui/movie-carousel";
import type { Movie } from "@/types/movie";

interface RelatedMoviesProps {
  movies: Movie[];
}

export function RelatedMovies({ movies }: RelatedMoviesProps) {
  if (!movies || movies.length === 0) {
    return (
      <div className="mt-8 text-center text-muted-foreground">
        <p>Không có phim liên quan</p>
      </div>
    );
  }
  
  return (
    <div>
      <Separator className="my-8" />
      <h2 className="text-xl font-semibold mb-6">Phim liên quan</h2>
      <MovieCarousel movies={movies} />
    </div>
  );
} 