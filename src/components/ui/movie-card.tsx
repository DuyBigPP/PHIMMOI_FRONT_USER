import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
  className?: string;
  priority?: boolean;
}

export function MovieCard({ movie, className, priority = false }: MovieCardProps) {
  return (
    <Card className={cn("group overflow-hidden rounded-lg border-0 shadow-md transition-all hover:shadow-xl", className)}>
      <CardContent className="p-0">
        <div className="relative">
          {/* Movie Poster */}
          <Link to={`/phim/${movie.slug}`} className="block relative aspect-[2/3] overflow-hidden">
            <img
              src={movie.posterUrl || movie.poster}
              alt={movie.name || 'Movie poster'}
              loading={priority ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105 bg-zinc-900"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            
            {/* Hover Play Button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-0 transition-opacity group-hover:opacity-100">
              <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full bg-primary/90 text-primary-foreground">
                <Play className="h-6 w-6" />
              </Button>
            </div>
          </Link>
          
          {/* Movie Quality */}
          {movie.quality && (
            <Badge className="absolute left-2 top-2 bg-primary">{movie.quality}</Badge>
          )}
          
          {/* Movie Rating */}
          <div className="absolute right-2 top-2 flex items-center rounded-md bg-black/70 px-1.5 py-0.5 text-xs text-yellow-400">
            <Star className="mr-0.5 h-3 w-3 fill-current" />
            <span>{(movie.rating || 0).toFixed(1)}</span>
          </div>
        </div>
        
        {/* Movie Info */}
        <div className="p-3">
          <h3 className="line-clamp-1 font-medium">{movie.name || 'Không có tiêu đề'}</h3>
          {movie.originName && movie.originName !== movie.name && (
            <p className="line-clamp-1 text-sm text-muted-foreground">{movie.originName}</p>
          )}
          <div className="mt-1 flex items-center text-sm text-muted-foreground">
            <span>{movie.year || 'N/A'}</span>
            <span className="mx-1">•</span>
            <span>{movie.time || (movie.duration ? `${movie.duration} phút` : 'N/A')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 