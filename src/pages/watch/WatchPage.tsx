import { useState, useEffect, useRef, memo, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieBySlug } from "@/service/function";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Info} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LoadingAnimation from "@/components/common/loading_animation";
import { MovieDetail, MovieEpisode } from "@/types/movie";
import Hls from "hls.js";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ShareButton } from "@/components/ui/share-button";

// Native HLS Video Player using hls.js
const StableVideoPlayer = memo(({ episode }: { episode: MovieEpisode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Extract video source from episode
  const videoSrc = useMemo(() => {
    if (episode.linkM3u8) {
      return episode.linkM3u8;
    } else if (episode.linkEmbed) {
      // If only embed is available, we can't use it with hls.js
      setError("Không hỗ trợ định dạng video này");
      return null;
    }
    return null;
  }, [episode]);

  useEffect(() => {
    // Clean up previous instance when component unmounts or video source changes
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [episode.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    setIsLoading(true);
    setError(null);

    const loadVideo = async () => {
      try {
        // Check if HLS is supported by native browser
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari)
          video.src = videoSrc;
          video.addEventListener('loadedmetadata', () => {
            setIsLoading(false);
          });
        } else if (Hls.isSupported()) {
          // Use HLS.js for browsers without native HLS support
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          
          hlsRef.current = hls;
          
          hls.attachMedia(video);
          hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            hls.loadSource(videoSrc);
          });
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setIsLoading(false);
            video.play().catch(error => {
              console.warn('Autoplay prevented:', error);
            });
          });
          
          hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  // Try to recover network error
                  console.log('Fatal network error', data);
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  // Try to recover media error
                  console.log('Fatal media error', data);
                  hls.recoverMediaError();
                  break;
                default:
                  // Cannot recover
                  setError('Không thể phát video');
                  hls.destroy();
                  break;
              }
            }
          });
        } else {
          setError('Trình duyệt không hỗ trợ phát video HLS');
        }
      } catch (err) {
        console.error('Video player error:', err);
        setError('Có lỗi khi phát video');
        setIsLoading(false);
      }
    };

    loadVideo();
  }, [videoSrc, episode.id]);

  if (!videoSrc || error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-xl font-medium text-white">
            {error || "Không có nguồn phát"}
          </p>
          <p className="mt-2 text-sm text-white/70">
            {error 
              ? "Vui lòng thử lại sau hoặc chọn nguồn phát khác" 
              : "Không thể tải nguồn phát cho phim này"}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-contain bg-black"
      />
    </div>
  );
});

StableVideoPlayer.displayName = "StableVideoPlayer";

// Component hiển thị danh sách tập phim
const EpisodeList = memo(({ episodes, currentEpisodeId, movieSlug }: { 
  episodes: MovieEpisode[], 
  currentEpisodeId: string, 
  movieSlug: string 
}) => {
  return (
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
  }, [stableSlug]); // Chỉ depend vào stableSlug

  // Set episode khi movie hoặc episodeSlug thay đổi
  useEffect(() => {
    if (!movie?.episodes) return;
    
    const episode = findEpisode(movie.episodes, stableEpisodeSlug);
    if (episode) {
      setCurrentEpisode(episode);
    }
  }, [movie, stableEpisodeSlug]); // Depend vào movie và stableEpisodeSlug

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
      
      {/* Video Player */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        {currentEpisode && (
          <StableVideoPlayer episode={currentEpisode} />
        )}
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