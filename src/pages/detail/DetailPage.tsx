import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieBySlug, getRelatedMovies, createView } from "@/service/function";
import type { Movie, MovieDetail } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MovieCard } from "@/components/ui/movie-card";
import { Play, Calendar, Clock, Star, Globe, FileText } from "lucide-react";
import LoadingAnimation from "@/components/common/loading_animation";

export default function DetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    // Tránh fetch dữ liệu nhiều lần trong development mode với React.StrictMode
    if (dataFetchedRef.current) return;
    
    const fetchMovieData = async () => {
      if (slug) {
        setLoading(true);
        try {
          // Lấy chi tiết phim
          const movieResponse = await getMovieBySlug(slug);
          if (movieResponse.success && movieResponse.data) {
            // Chuyển đổi kiểu dữ liệu từ API response sang MovieDetail
            const movieData = movieResponse.data as unknown as MovieDetail;
            setMovie(movieData);
            
            // Tạo view khi xem phim
            if (movieData.id) {
              await createView(movieData.id);
            
              // Lấy phim liên quan
              try {
                const relatedResponse = await getRelatedMovies(movieData.id, 4);
                if (relatedResponse.success && relatedResponse.data) {
                  setRelatedMovies(relatedResponse.data.movies);
                }
              } catch (relatedErr) {
                console.error("Lỗi khi tải phim liên quan:", relatedErr);
                // Không hiển thị lỗi cho người dùng khi không tải được phim liên quan
              }
            }
            
            dataFetchedRef.current = true;
          } else {
            throw new Error(movieResponse.message || "Không thể tải dữ liệu phim");
          }
        } catch (err) {
          console.error("Lỗi khi tải dữ liệu:", err);
          setError("Có lỗi xảy ra khi tải dữ liệu phim");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMovieData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
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

  const isTVShow = movie.type === 'series';
  const hasRating = movie.tmdbVoteAverage && movie.tmdbVoteAverage > 0;
  
  // Xác định link xem phim
  const getWatchUrl = () => {
    if (!movie.episodes || movie.episodes.length === 0) return null;
    
    const firstEpisode = movie.episodes[0];
    if (firstEpisode.linkEmbed) {
      return firstEpisode.linkEmbed;
    } else if (firstEpisode.linkM3u8) {
      return `https://player.phimapi.com/player/?url=${firstEpisode.linkM3u8}`;
    }
    return null;
  };
  
  const watchUrl = getWatchUrl();

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative -mx-4 -mt-6 h-[50vh] min-h-[300px] md:h-[60vh]">
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: `url(${movie.thumbUrl || movie.posterUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column - Poster and Action Buttons */}
        <div className="md:col-span-1">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
            <img
              src={movie.posterUrl}
              alt={movie.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {movie.quality && (
              <Badge className="absolute left-2 top-2 bg-primary">{movie.quality}</Badge>
            )}
          </div>
          
          <div className="mt-4 space-y-3">
            {watchUrl ? (
              <Button 
                className="w-full" 
                onClick={() => window.open(watchUrl, '_blank')}
              >
                <Play className="mr-2 h-4 w-4" />
                Xem Phim
              </Button>
            ) : (
              <Button 
                className="w-full" 
                asChild
              >
                <Link to={`/xem-phim/${movie.slug}`}>
                  <Play className="mr-2 h-4 w-4" />
                  Xem Phim
                </Link>
              </Button>
            )}
            {movie.trailerUrl && (
              <Button variant="outline" className="w-full" onClick={() => window.open(movie.trailerUrl, '_blank')}>
                Xem Trailer
              </Button>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold md:text-4xl">{movie.name}</h1>
          {movie.originName && movie.originName !== movie.name && (
            <p className="mt-2 text-xl text-muted-foreground">{movie.originName}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4">
            {hasRating && (
              <div className="flex items-center">
                <Star className="mr-1 h-5 w-5 text-yellow-400" />
                <span className="font-medium">{movie.tmdbVoteAverage.toFixed(1)}</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="mr-1 h-5 w-5 text-muted-foreground" />
              <span>{movie.year}</span>
            </div>
            {movie.time && (
              <div className="flex items-center">
                <Clock className="mr-1 h-5 w-5 text-muted-foreground" />
                <span>{movie.time}</span>
              </div>
            )}
            {movie.countries && movie.countries.length > 0 && (
              <div className="flex items-center">
                <Globe className="mr-1 h-5 w-5 text-muted-foreground" />
                <span>{movie.countries.map(c => c.country.name).join(', ')}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {movie.categories && movie.categories.map((cat) => (
              <Badge 
                key={cat.category.id} 
                variant="secondary"
                className="rounded-md px-2.5 py-1"
              >
                {cat.category.name}
              </Badge>
            ))}
          </div>

          <Separator className="my-4" />

          <div>
            <h2 className="flex items-center text-xl font-semibold">
              <FileText className="mr-2 h-5 w-5" />
              Nội dung phim
            </h2>
            <p className="mt-2 text-muted-foreground">{movie.content}</p>
          </div>

          {/* Actors */}
          {movie.actors && movie.actors.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <h2 className="mb-3 text-xl font-semibold">Diễn viên</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.actors.slice(0, 10).map((actor) => (
                    <Badge key={actor.actor.id} variant="outline" className="text-sm">
                      {actor.actor.name}
                    </Badge>
                  ))}
                  {movie.actors.length > 10 && (
                    <Badge variant="outline" className="text-sm">
                      +{movie.actors.length - 10} diễn viên khác
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Directors */}
          {movie.directors && movie.directors.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <h2 className="mb-3 text-xl font-semibold">Đạo diễn</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.directors.map((director) => (
                    <Badge key={director.director.id} variant="outline" className="text-sm">
                      {director.director.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Episodes list for TV Shows */}
          {isTVShow && movie.episodes && movie.episodes.length > 0 && (
            <>
              <Separator className="my-4" />
              
              <div>
                <h2 className="mb-3 text-xl font-semibold">Danh sách tập</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {movie.episodes.map((episode) => {
                    const episodeUrl = episode.linkEmbed || 
                                      (episode.linkM3u8 ? `https://player.phimapi.com/player/?url=${episode.linkM3u8}` : null);
                    
                    return (
                      <a 
                        key={episode.id}
                        href={episodeUrl || `#`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (!episodeUrl) {
                            e.preventDefault();
                            alert('Không có nguồn phát cho tập phim này');
                          }
                        }}
                        className="flex flex-col items-center rounded-md border p-1 transition-colors hover:bg-accent"
                      >
                        <span className="text-sm font-medium">{episode.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Related Movies */}
      {relatedMovies && relatedMovies.length > 0 && (
        <div>
          <Separator className="my-4" />
          <h2 className="text-xl font-semibold mb-4">Phim liên quan</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {relatedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 