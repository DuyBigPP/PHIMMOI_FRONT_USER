import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import type { MovieDetail } from "@/types/movie";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ShareButton } from "@/components/ui/share-button";

interface MoviePosterProps {
  movie: MovieDetail;
  className?: string;
}

export function MoviePoster({ movie, className }: MoviePosterProps) {
  const isMobile = className?.includes('mobile-poster');
  
  if (isMobile) {
    // Mobile version - compact side layout
    return (
      <div className="w-full">
        <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
          <img
            src={movie.posterUrl}
            alt={movie.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Image';
            }}
          />
          {movie.quality && (
            <Badge className="absolute left-1 top-1 bg-primary text-xs px-1.5 py-0.5">{movie.quality}</Badge>
          )}
        </div>
        
        {/* Mobile Action Buttons */}
        <div className="mt-3 space-y-2">
          <Button 
            className="w-full text-xs py-2" 
            size="sm"
            asChild
          >
            <Link to={`/xem-phim/${movie.slug}`}>
              <Play className="mr-1 h-3 w-3" />
              Xem
            </Link>
          </Button>
          
          <div className="flex gap-1">
            <FavoriteButton 
              movieId={movie.id} 
              variant="outline"
              size="sm"
              className="flex-1 text-xs py-1 px-1"
            />
            <ShareButton 
              variant="outline"
              size="sm"
              className="flex-1 text-xs py-1 px-1"
            />
          </div>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="space-y-4">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-xl max-w-sm mx-auto">
        <img
          src={movie.posterUrl}
          alt={movie.name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Image';
          }}
        />
        {movie.quality && (
          <Badge className="absolute left-2 top-2 bg-primary text-sm">{movie.quality}</Badge>
        )}
      </div>
      
      <div className="space-y-3 max-w-sm mx-auto">
        <Button 
          className="w-full" 
          asChild
        >
          <Link to={`/xem-phim/${movie.slug}`}>
            <Play className="mr-2 h-4 w-4" />
            Xem Phim
          </Link>
        </Button>
        {movie.trailerUrl && (
          <Button variant="outline" className="w-full" onClick={() => window.open(movie.trailerUrl, '_blank')}>
            Xem Trailer
          </Button>
        )}
        
        <div className="flex gap-2">
          <FavoriteButton 
            movieId={movie.id} 
            variant="outline"
            size="sm"
            className="flex-1"
          />
          <ShareButton 
            variant="outline"
            size="sm"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}