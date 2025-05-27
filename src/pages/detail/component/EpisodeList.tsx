import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MovieDetail } from "@/types/movie";

interface EpisodeListProps {
  movie: MovieDetail;
}

export function EpisodeList({ movie }: EpisodeListProps) {
  // More flexible TV show detection - include all possible TV show types
  const isTVShow = movie.type === 'series' || 
                   movie.type === 'tv' || 
                   movie.type === 'hoathinh' ||
                   movie.type === 'tvshows' ||
                   movie.type === 'phim-bo' ||
                   (movie.episodes && movie.episodes.length > 0); // Fallback: if has episodes, treat as TV show
  
  // Debug logging
  console.log('EpisodeList Debug:', {
    movieName: movie.name,
    movieType: movie.type,
    isTVShow,
    hasEpisodes: !!movie.episodes,
    episodeCount: movie.episodes?.length || 0,
    episodes: movie.episodes
  });
  
  if (!isTVShow) {
    console.log(`Movie "${movie.name}" is not a TV show (type: ${movie.type})`);
    return null;
  }
  
  if (!movie.episodes) {
    console.log(`TV Show "${movie.name}" has no episodes property`);
    return null;
  }
  
  if (movie.episodes.length === 0) {
    console.log(`TV Show "${movie.name}" has empty episodes array`);
    return null;
  }
    return (
    <>
      <Separator className="my-6" />
      
      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Danh sách tập ({movie.episodes.length} tập)
        </h2>
        
        {/* Scrollable container for episodes */}
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {movie.episodes.map((episode) => (
              <Link 
                key={episode.id}
                to={`/xem-phim/${movie.slug}/${episode.slug}`}
                className="flex items-center justify-center rounded-md border p-2 text-center transition-colors hover:bg-accent min-h-[40px]"
              >
                <span className="text-sm font-medium truncate">{episode.name}</span>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}