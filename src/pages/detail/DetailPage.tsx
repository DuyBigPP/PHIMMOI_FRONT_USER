import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieBySlug, getRelatedMovies, createView } from "@/service/function";
import type { Movie, TVShow } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { MovieCard } from "@/components/ui/movie-card";
import { Play, Calendar, Clock, Star, Globe, FileText } from "lucide-react";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [media, setMedia] = useState<Movie | TVShow | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (id) {
        setLoading(true);
        try {
          // Lấy chi tiết phim
          const movieResponse = await getMovieBySlug(id);
          if (movieResponse.data) {
            const movie = movieResponse.data.movies[0];
            setMedia(movie);
            
            // Tạo view khi xem phim
            await createView(movie.id);
            
            // Lấy phim liên quan
            const relatedResponse = await getRelatedMovies(movie.id, 4);
            if (relatedResponse.data) {
              setRelatedMovies(relatedResponse.data.movies);
            }
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
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-2 text-red-500">{error}</h1>
        <Button asChild>
          <Link to="/home-page">Về Trang Chủ</Link>
        </Button>
      </div>
    );
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

  const isTVShow = media?.type === 'tv';
  const tvShow = isTVShow ? (media as TVShow) : null;

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative -mx-4 -mt-6 h-[50vh] min-h-[300px] md:h-[60vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${media.backdrop || media.poster})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column - Poster and Action Buttons */}
        <div className="md:col-span-1">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
            <img
              src={media.poster}
              alt={media.title}
              className="h-full w-full object-cover"
            />
            {media.quality && (
              <Badge className="absolute left-2 top-2 bg-primary">{media.quality}</Badge>
            )}
          </div>
          
          <div className="mt-4 space-y-3">
            <Button className="w-full" asChild>
              <Link to={`/xem-phim/${media.id}`} className="flex items-center justify-center">
                <Play className="mr-2 h-4 w-4" />
                Xem Phim
              </Link>
            </Button>
            {media.trailer && (
              <Button variant="outline" className="w-full">
                Xem Trailer
              </Button>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold md:text-4xl">{media.title}</h1>
          {media.originalTitle && media.originalTitle !== media.title && (
            <p className="mt-2 text-xl text-muted-foreground">{media.originalTitle}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <Star className="mr-1 h-5 w-5 text-yellow-400" />
              <span className="font-medium">{media.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-5 w-5 text-muted-foreground" />
              <span>{new Date(media.releaseDate).getFullYear()}</span>
            </div>
            {media.runtime && (
              <div className="flex items-center">
                <Clock className="mr-1 h-5 w-5 text-muted-foreground" />
                <span>{media.runtime} phút</span>
              </div>
            )}
            <div className="flex items-center">
              <Globe className="mr-1 h-5 w-5 text-muted-foreground" />
              <span>{media.country}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {media.genres.map((genre) => (
              <Badge 
                key={genre.id} 
                variant="secondary"
                className="rounded-md px-2.5 py-1"
              >
                {genre.name}
              </Badge>
            ))}
          </div>

          <Separator className="my-6" />

          <div>
            <h2 className="flex items-center text-xl font-semibold">
              <FileText className="mr-2 h-5 w-5" />
              Nội dung phim
            </h2>
            <p className="mt-2 text-muted-foreground">{media.overview}</p>
          </div>

          {/* Episodes list for TV Shows */}
          {isTVShow && tvShow?.seasons && tvShow.seasons.length > 0 && (
            <>
              <Separator className="my-6" />
              
              <div>
                <h2 className="mb-4 text-xl font-semibold">Danh sách tập</h2>
                
                <Tabs 
                  defaultValue={tvShow.seasons[0].id} 
                >
                  <TabsList className="mb-4">
                    {tvShow.seasons.map((season) => (
                      <TabsTrigger key={season.id} value={season.id}>
                        {season.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {tvShow.seasons.map((season) => (
                    <TabsContent key={season.id} value={season.id}>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-1 divide-y">
                          {Array.from({ length: season.episodeCount }, (_, i) => (
                            <Link 
                              key={i}
                              to={`/xem-phim/${media.id}/season/${season.seasonNumber}/episode/${i + 1}`}
                              className="flex items-center justify-between p-3 hover:bg-accent"
                            >
                              <div className="flex items-center">
                                <span className="mr-3 font-medium">{i + 1}</span>
                                <span>Tập {i + 1}</span>
                              </div>
                              <Play className="h-4 w-4" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Phim liên quan</h2>
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