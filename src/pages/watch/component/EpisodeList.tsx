import { memo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MovieEpisode } from "@/types/movie";

interface EpisodeListProps {
  episodes: MovieEpisode[];
  currentEpisodeId: string;
  movieSlug: string;
}

const EpisodeList = memo(({ episodes, currentEpisodeId, movieSlug }: EpisodeListProps) => {
  const currentEpisodeRef = useRef<HTMLAnchorElement>(null);

  // Auto-scroll to current episode when component mounts or current episode changes
  useEffect(() => {
    if (currentEpisodeRef.current) {
      currentEpisodeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentEpisodeId]);

  if (!episodes || episodes.length === 0) {
    return null;
  }

  // Find current episode index for better UX
  const currentEpisodeIndex = episodes.findIndex(ep => ep.id === currentEpisodeId);

  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold">
        Danh sách tập ({episodes.length} tập)
        {currentEpisodeIndex >= 0 && (
          <span className="ml-2 text-sm font-normal text-muted-foreground">
          </span>
        )}
      </h2>
      
      {/* Scrollable container for episodes */}
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {episodes.map((episode) => (
            <Link 
              key={episode.id}
              ref={currentEpisodeId === episode.id ? currentEpisodeRef : null}
              to={`/xem-phim/${movieSlug}/${episode.slug}`}
              className={`flex flex-col items-center rounded-md border p-1 transition-colors hover:bg-accent ${
                currentEpisodeId === episode.id ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              <span className="text-sm font-medium">{episode.name}</span>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
});

EpisodeList.displayName = "EpisodeList";

export default EpisodeList; 