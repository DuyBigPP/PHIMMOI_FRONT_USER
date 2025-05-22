import { useState, useEffect, memo, useMemo, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMovieBySlug } from "@/service/function";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Info, Share2, ThumbsUp, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LoadingAnimation from "@/components/common/loading_animation";
import { MovieDetail, MovieEpisode } from "@/types/movie";

// Component hiển thị danh sách tập phim
const EpisodeList = memo(({ episodes, currentEpisodeId, movieSlug }: { 
  episodes: MovieEpisode[], 
  currentEpisodeId: string, 
  movieSlug: string,
  onEpisodeClick?: (episode: MovieEpisode) => void
}) => {
  const navigate = useNavigate();
  
  const handleEpisodeClick = useCallback((episode: MovieEpisode, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Redirect to external player if available
    if (episode.linkEmbed) {
      window.open(episode.linkEmbed, '_blank');
    } else if (episode.linkM3u8) {
      window.open(`https://player.phimapi.com/player/?url=${episode.linkM3u8}`, '_blank');
    } else {
      // Fallback to internal route
      navigate(`/xem-phim/${movieSlug}/${episode.slug}`);
    }
  }, [movieSlug, navigate]);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
      {episodes.map((episode) => (
        <a 
          key={episode.id}
          href={episode.linkEmbed || `https://player.phimapi.com/player/?url=${episode.linkM3u8}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => handleEpisodeClick(episode, e)}
          className={`flex flex-col items-center rounded-md border p-1 transition-colors hover:bg-accent ${
            currentEpisodeId === episode.id ? "bg-accent" : ""
          }`}
        >
          <span className="text-sm font-medium">{episode.name}</span>
        </a>
      ))}
    </div>
  );
});

EpisodeList.displayName = "EpisodeList";

export default function WatchPage() {
  const { slug, episodeSlug } = useParams<{ slug: string; episodeSlug?: string }>();
 
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<MovieEpisode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Sử dụng useMemo để tránh re-calculate
  const stableSlug = useMemo(() => slug, [slug]);
  const stableEpisodeSlug = useMemo(() => episodeSlug, [episodeSlug]);

  // Helper function to find episode
  const findEpisode = (episodes: MovieEpisode[], targetSlug?: string): MovieEpisode | null => {
    if (!episodes?.length) return null;
    
    if (targetSlug) {
      return episodes.find(ep => ep.slug === targetSlug) || episodes[0];
    }
    
    return episodes[0];
  };

  // Chuyển hướng người dùng đến trang xem phim
  const redirectToPlayer = useCallback((episode: MovieEpisode) => {
    if (episode.linkEmbed) {
      window.open(episode.linkEmbed, '_blank');
    } else if (episode.linkM3u8) {
      window.open(`https://player.phimapi.com/player/?url=${episode.linkM3u8}`, '_blank');
    }
  }, []);

  // Chỉ fetch movie khi slug thay đổi
  useEffect(() => {
    if (!stableSlug) {
      setLoading(false);
      return;
    }

    let isCancelled = false; // Cleanup flag

    setLoading(true);
    setError(null);

    const loadMovie = async () => {
      try {
        const response = await getMovieBySlug(stableSlug);
        
        if (isCancelled) return; // Prevent state update if component unmounted
        
        if (response.success && response.data) {
          const movieData = response.data as unknown as MovieDetail;
          setMovie(movieData);
          
          // Tìm episode phù hợp
          const episode = findEpisode(movieData.episodes, stableEpisodeSlug);
          if (episode) {
            setCurrentEpisode(episode);
            
            // Nếu đang ở route xem phim (có episodeSlug), tự động redirect
            if (stableEpisodeSlug) {
              redirectToPlayer(episode);
            }
          }
        } else {
          setError(response.message || "Không thể tải dữ liệu phim");
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Load error:", err);
          setError("Có lỗi xảy ra khi tải dữ liệu phim");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadMovie();

    return () => {
      isCancelled = true; // Cleanup
    };
  }, [stableSlug, stableEpisodeSlug, redirectToPlayer]);

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
  const episodeTitle = isTVShow ? `${movie.name} - ${currentEpisode.name}` : movie.name;
  
  // Determine player URL
  const playerUrl = currentEpisode.linkEmbed || 
                    (currentEpisode.linkM3u8 ? `https://player.phimapi.com/player/?url=${currentEpisode.linkM3u8}` : null);

  return (
    <div className="space-y-6">
      {/* Back to Details Button */}
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-auto">
          <Link to={`/phim/${movie.slug}`} className="flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại
          </Link>
        </Button>
      </div>
      
      {/* Video Player Preview */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-6">{episodeTitle}</h2>
          {playerUrl ? (
            <Button 
              size="lg" 
              onClick={() => window.open(playerUrl, '_blank')}
              className="bg-primary hover:bg-primary/90"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Xem Phim
            </Button>
          ) : (
            <p className="text-white/70">Không có nguồn phát cho phim này</p>
          )}
        </div>
      </div>

      {/* Title and Actions */}
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
          <Button size="sm" variant="ghost" className="h-8">
            <ThumbsUp className="mr-1 h-4 w-4" />
            Thích
          </Button>
          <Button size="sm" variant="ghost" className="h-8">
            <Share2 className="mr-1 h-4 w-4" />
            Chia sẻ
          </Button>
          <Button size="sm" variant="ghost" className="h-8">
            <Download className="mr-1 h-4 w-4" />
            Tải xuống
          </Button>
          <Button size="sm" variant="ghost" className="h-8" asChild>
            <Link to={`/phim/${movie.slug}`}>
              <Info className="mr-1 h-4 w-4" />
              Chi tiết
            </Link>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Episode Navigation for TV Shows */}
      {isTVShow && movie.episodes && movie.episodes.length > 0 && (
        <div>
          <h2 className="mb-3 text-xl font-semibold">Danh sách tập</h2>
          <EpisodeList 
            episodes={movie.episodes} 
            currentEpisodeId={currentEpisode.id} 
            movieSlug={movie.slug}
          />
        </div>
      )}

      {/* Movie Content */}
      <div>
        <h2 className="mb-3 text-xl font-semibold">Nội dung phim</h2>
        <p className="text-muted-foreground">{movie.content}</p>
      </div>
    </div>
  );
}