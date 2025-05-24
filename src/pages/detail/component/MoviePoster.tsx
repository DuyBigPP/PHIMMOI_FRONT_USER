import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import type { MovieDetail } from "@/types/movie";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ShareButton } from "@/components/ui/share-button";

interface MoviePosterProps {
  movie: MovieDetail;
}

export function MoviePoster({ movie }: MoviePosterProps) {
  return (
    <div className="md:col-span-1">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
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
          <Badge className="absolute left-2 top-2 bg-primary">{movie.quality}</Badge>
        )}
      </div>
      
      <div className="mt-4 space-y-3">
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
        
        <div className="flex justify-between gap-2 mt-2">
          <FavoriteButton 
            movieId={movie.id} 
            variant="outline"
            size="default"
            className="flex-1"
          />
          <ShareButton 
            variant="outline"
            size="default"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
} 