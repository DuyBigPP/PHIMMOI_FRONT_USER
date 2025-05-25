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
      <Separator className="my-6" />
      
      <div>
        <h2 className="mb-4 text-xl font-semibold">Danh sách tập</h2>
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
      </div>
    </>
  );
} 