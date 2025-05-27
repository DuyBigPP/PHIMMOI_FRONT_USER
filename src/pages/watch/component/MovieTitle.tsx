import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ShareButton } from "@/components/ui/share-button";
import { MovieDetail, MovieEpisode } from "@/types/movie";

interface MovieTitleProps {
  movie: MovieDetail;
  currentEpisode: MovieEpisode;
}

const MovieTitle = ({ movie, currentEpisode }: MovieTitleProps) => {
  const isTVShow = movie.type === 'series' || 
                   movie.type === 'tv' || 
                   movie.type === 'hoathinh' ||
                   movie.type === 'tvshows' ||
                   movie.type === 'phim-bo' ||
                   (movie.episodes && movie.episodes.length > 0);
  const episodeTitle = isTVShow ? `${movie.name} - ${currentEpisode.name}` : movie.name;

  return (
    <div>
      <h1 className="text-2xl font-bold">
        {episodeTitle}
      </h1>
      
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {movie.quality && (
          <Badge variant="outline">{movie.quality}</Badge>
        )}
        <Badge variant="outline">{movie.lang}</Badge>
        <span className="text-muted-foreground">{movie.year}</span>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <FavoriteButton movieId={movie.id} size="sm" variant="ghost" className="h-8" />
        <ShareButton size="sm" variant="ghost" className="h-8" />
        <Button size="sm" variant="ghost" className="h-8" asChild>
          <Link to={`/phim/${movie.slug}`}>
            <Info className="mr-1 h-4 w-4" />
            Chi tiết
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default MovieTitle; 