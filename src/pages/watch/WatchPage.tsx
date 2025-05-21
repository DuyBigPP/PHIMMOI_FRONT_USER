import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieById } from "@/lib/mock-data";
import type { Movie, TVShow } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ChevronRight, Download, Info, Share2, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MovieCard } from "@/components/ui/movie-card";

export default function WatchPage() {
  const { id, seasonId, episodeId } = useParams<{ id: string; seasonId?: string; episodeId?: string }>();
  const [media, setMedia] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      
      // Get movie/show details
      const movieData = getMovieById(id);
      if (movieData) {
        setMedia(movieData);
        
        // Get related movies (in real app, this would be an API call)
        // For now we'll just simulate with mock data
        setRelatedMovies(
          Array.from({ length: 4 }, (_, i) => ({
            ...movieData,
            id: `related-${movieData.id}-${i}`,
            title: `${movieData.title} ${i + 1}`,
          }))
        );
      }
      
      setLoading(false);
    }
  }, [id, seasonId, episodeId]);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!media) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-2">Không tìm thấy phim</h1>
        <p className="text-muted-foreground mb-4">
          Phim bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Button asChild>
          <Link to="/home-page">Về Trang Chủ</Link>
        </Button>
      </div>
    );
  }

  const isTVShow = media.type === 'tv';
  const tvShow = media as TVShow;
  
  // Get current episode info for TV shows
  let currentEpisode = 1;
  let currentSeason = 1;
  let episodeTitle = `Tập ${currentEpisode}`;
  
  if (isTVShow && seasonId && episodeId) {
    currentSeason = parseInt(seasonId, 10);
    currentEpisode = parseInt(episodeId, 10);
    episodeTitle = `${tvShow.title} - Phần ${currentSeason} - Tập ${currentEpisode}`;
  }

  return (
    <div className="space-y-8">
      {/* Back to Details Button */}
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-auto">
          <Link to={`/phim/${media.id}`} className="flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại
          </Link>
        </Button>
      </div>
      
      {/* Video Player */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-medium text-white">Video Player</p>
            <p className="mt-2 text-sm text-white/70">
              {isTVShow ? episodeTitle : media.title}
            </p>
          </div>
        </div>
      </div>

      {/* Title and Actions */}
      <div>
        <h1 className="text-2xl font-bold">
          {isTVShow ? episodeTitle : media.title}
        </h1>
        
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {media.quality && (
            <Badge variant="outline">{media.quality}</Badge>
          )}
          <Badge variant="outline">{media.language.toUpperCase()}</Badge>
          <span className="text-muted-foreground">{new Date(media.releaseDate).getFullYear()}</span>
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
            <Link to={`/phim/${media.id}`}>
              <Info className="mr-1 h-4 w-4" />
              Chi tiết
            </Link>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Episode Navigation for TV Shows */}
      {isTVShow && tvShow.seasons && tvShow.seasons.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Danh sách tập</h2>
          
          <Tabs 
            defaultValue={currentSeason.toString()} 
            className="w-full"
          >
            <TabsList className="mb-4">
              {tvShow.seasons.map((season) => (
                <TabsTrigger 
                  key={season.id} 
                  value={season.seasonNumber.toString()}
                >
                  {season.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {tvShow.seasons.map((season) => (
              <TabsContent 
                key={season.id} 
                value={season.seasonNumber.toString()}
              >
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {Array.from({ length: season.episodeCount }, (_, i) => (
                    <Link 
                      key={i}
                      to={`/xem-phim/${media.id}/season/${season.seasonNumber}/episode/${i + 1}`}
                      className={`flex flex-col items-center rounded-md border p-2 transition-colors hover:bg-accent ${
                        currentSeason === season.seasonNumber && currentEpisode === i + 1
                          ? "bg-accent"
                          : ""
                      }`}
                    >
                      <div className="aspect-video w-full bg-muted mb-2 flex items-center justify-center">
                        <span className="text-lg font-bold">{i + 1}</span>
                      </div>
                      <span className="text-sm">Tập {i + 1}</span>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Phim liên quan</h2>
            <Button variant="link" size="sm" asChild>
              <Link to="/home-page" className="flex items-center">
                Xem thêm <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {relatedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 