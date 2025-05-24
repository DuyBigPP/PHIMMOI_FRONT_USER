import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/types/movie";

// Extended movie type to handle both Movie and MovieDetail properties
interface MovieCardData extends Movie {
  tmdbVoteAverage?: number;
  // Các thuộc tính bổ sung khác mà không sử dụng any
  createdAt?: string;
  updatedAt?: string;
  isCopyright?: boolean;
  subDocquyen?: boolean;
  chieurap?: boolean;
  episodeCurrent?: string;
  episodeTotal?: string;
  lang?: string;
  notify?: string;
  showtimes?: string;
  view?: number;
  tmdbId?: string;
  tmdbType?: string;
  tmdbVoteCount?: number;
  imdbId?: string | null;
}

interface MovieCardProps {
  movie: MovieCardData;
  className?: string;
  priority?: boolean;
}

export function MovieCard({ movie, className, priority = false }: MovieCardProps) {

  
  // Poster fallback
  const posterUrl = movie.posterUrl || movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster';

  return (
    <Card className={cn("group overflow-hidden rounded-lg border-0 shadow-md transition-all hover:shadow-xl", className)}>
      <CardContent className="p-0">
        <div className="relative">
          {/* Movie Poster */}
          <Link to={`/phim/${movie.slug}`} className="block relative aspect-[2/3] overflow-hidden">
            <img
              src={posterUrl}
              alt={movie.name || 'Movie poster'}
              loading={priority ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105 bg-zinc-900"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            
            {/* Hover Play Button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-0 transition-opacity group-hover:opacity-100">
              <Button size="icon" variant="secondary" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/90 text-primary-foreground">
                <Play className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </div>
          </Link>
          
          {/* Movie Quality */}
          {movie.quality && (
            <Badge className="absolute left-2 top-2 bg-primary text-xs">{movie.quality}</Badge>
          )}
        </div>
        
        {/* Movie Info */}
        <div className="p-2 sm:p-3">
          <h3 className="line-clamp-1 text-sm sm:text-base font-medium">{movie.name || 'Không có tiêu đề'}</h3>
          {movie.originName && movie.originName !== movie.name && (
            <p className="line-clamp-1 text-xs sm:text-sm text-muted-foreground">{movie.originName}</p>
          )}
          <div className="mt-1 flex items-center text-xs sm:text-sm text-muted-foreground">
            <span>{movie.year || 'N/A'}</span>
            <span className="mx-1">•</span>
            <span>{movie.time || (movie.duration ? `${movie.duration} phút` : 'N/A')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 