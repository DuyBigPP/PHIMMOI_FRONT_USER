import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/ui/movie-card";
import { ChevronRight } from "lucide-react";
import type { Movie } from "@/types/movie";

interface MovieSectionProps {
  title: string;
  viewAllHref?: string;
  movies: Movie[];
  className?: string;
}

export function MovieSection({
  title,
  viewAllHref,
  movies,
  className,
}: MovieSectionProps) {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
        {viewAllHref && (
          <Button variant="link" size="sm" asChild className="text-sm font-medium">
            <Link to={viewAllHref} className="flex items-center">
              Xem tất cả <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id || index}
            movie={movie}
            priority={index < 4}
          />
        ))}
      </div>
    </section>
  );
} 