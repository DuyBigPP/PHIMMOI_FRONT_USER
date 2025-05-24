import { memo } from "react";
import { Link } from "react-router-dom";
import { MovieEpisode } from "@/types/movie";

interface EpisodeListProps {
  episodes: MovieEpisode[];
  currentEpisodeId: string;
  movieSlug: string;
}

const EpisodeList = memo(({ episodes, currentEpisodeId, movieSlug }: EpisodeListProps) => {
  if (!episodes || episodes.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold">Danh sách tập</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {episodes.map((episode) => (
          <Link 
            key={episode.id}
            to={`/xem-phim/${movieSlug}/${episode.slug}`}
            className={`flex flex-col items-center rounded-md border p-1 transition-colors hover:bg-accent ${
              currentEpisodeId === episode.id ? "bg-accent" : ""
            }`}
          >
            <span className="text-sm font-medium">{episode.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
});

EpisodeList.displayName = "EpisodeList";

export default EpisodeList; 