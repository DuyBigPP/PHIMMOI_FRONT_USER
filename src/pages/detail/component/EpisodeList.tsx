import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import type { MovieDetail } from "@/types/movie";

interface EpisodeListProps {
  movie: MovieDetail;
}

export function EpisodeList({ movie }: EpisodeListProps) {
  const isTVShow = movie.type === 'series';
  
  if (!isTVShow || !movie.episodes || movie.episodes.length === 0) {
    return null;
  }
  
  return (
    <>
      <Separator className="my-4" />
      
      <div>
        <h2 className="mb-3 text-xl font-semibold">Danh sách tập</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {movie.episodes.map((episode) => (
            <Link 
              key={episode.id}
              to={`/xem-phim/${movie.slug}/${episode.slug}`}
              className="flex flex-col items-center rounded-md border p-1 transition-colors hover:bg-accent"
            >
              <span className="text-sm font-medium">{episode.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
} 