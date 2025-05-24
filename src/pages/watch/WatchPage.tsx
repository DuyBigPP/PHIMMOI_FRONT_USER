import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LoadingAnimation from "@/components/common/loading_animation";
import CommentSection from "@/components/common/comment_section";

// Import các component đã tách
import VideoPlayer from "./component/VideoPlayer";
import EpisodeList from "./component/EpisodeList";
import WatchPageHeader from "./component/WatchPageHeader";
import MovieTitle from "./component/MovieTitle";
import MovieContent from "./component/MovieContent";
import { useWatchPage } from "./component/useWatchPage";

export default function WatchPage() {
  const { slug, episodeSlug } = useParams<{ slug: string; episodeSlug?: string }>();
  const { movie, currentEpisode, loading, error } = useWatchPage(slug, episodeSlug);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-2 text-red-500">{error}</h1>
        <Button asChild>
          <Link to="/">Về Trang Chủ</Link>
        </Button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-2">Không tìm thấy phim</h1>
        <p className="text-muted-foreground mb-4">
          Phim bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Button asChild>
          <Link to="/">Về Trang Chủ</Link>
        </Button>
      </div>
    );
  }

  if (!currentEpisode) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-2">Không tìm thấy tập phim</h1>
        <p className="text-muted-foreground mb-4">
          Tập phim bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Button asChild>
          <Link to={`/phim/${movie.slug}`}>Về Trang Chi Tiết</Link>
        </Button>
      </div>
    );
  }

  const isTVShow = movie.type === 'series';

  return (
    <div className="space-y-6">
      {/* Back to Details Button */}
      <WatchPageHeader movieSlug={movie.slug} />
      
      {/* Video Player */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <VideoPlayer episode={currentEpisode} />
      </div>

      {/* Title and Actions */}
      <MovieTitle movie={movie} currentEpisode={currentEpisode} />

      <Separator />

      {/* Episode Navigation for TV Shows */}
      {isTVShow && movie.episodes && movie.episodes.length > 0 && (
        <EpisodeList 
          episodes={movie.episodes} 
          currentEpisodeId={currentEpisode.id} 
          movieSlug={movie.slug} 
        />
      )}

      {/* Movie Content */}
      <MovieContent movie={movie} />
      
      {/* Comment and Rating Section */}
      <CommentSection movieId={movie.id} className="mt-8" />
    </div>
  );
}