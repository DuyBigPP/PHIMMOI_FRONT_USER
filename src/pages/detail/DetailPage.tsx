import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieBySlug, getRelatedMovies, createView } from "@/service/function";
import type { Movie, MovieDetail } from "@/types/movie";
import { Button } from "@/components/ui/button";
import LoadingAnimation from "@/components/common/loading_animation";

// Import các component mới
import { MovieHeroBanner } from "./component/MovieHeroBanner";
import { MoviePoster } from "./component/MoviePoster";
import { MovieInfo } from "./component/MovieInfo";
import { EpisodeList } from "./component/EpisodeList";
import { RelatedMovies } from "./component/RelatedMovies";
import CommentSection from "@/components/common/comment_section";

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
                console.log("Đang lấy phim liên quan cho movie ID:", movieData.id);
                const relatedResponse = await getRelatedMovies(movieData.id, 8);
                console.log("API Response for related movies:", relatedResponse);
                
                if (relatedResponse.success && relatedResponse.data) {
                  // Kiểm tra xem API trả về cấu trúc đúng không
                  if (Array.isArray(relatedResponse.data.movies)) {
                    console.log("Số lượng phim liên quan:", relatedResponse.data.movies.length);
                    
                    // Lọc ra các phim có đủ thông tin cần thiết
                    const validMovies = relatedResponse.data.movies.filter(movie => 
                      movie && movie.id && movie.name && movie.slug
                    );
                    
                    console.log("Số lượng phim liên quan hợp lệ:", validMovies.length);
                    setRelatedMovies(validMovies);
                  } else if (Array.isArray(relatedResponse.data)) {
                    // Trường hợp API trả về mảng trực tiếp
                    console.log("API trả về mảng trực tiếp, số lượng:", relatedResponse.data.length);
                    
                    const validMovies = relatedResponse.data.filter(movie => 
                      movie && movie.id && movie.name && movie.slug
                    );
                    
                    console.log("Số lượng phim liên quan hợp lệ:", validMovies.length);
                    setRelatedMovies(validMovies);
                  } else {
                    console.log("Không có phim liên quan hoặc định dạng dữ liệu không đúng");
                    console.log("Cấu trúc dữ liệu trả về:", relatedResponse.data);
                  }
                } else {
                  console.log("Không có phim liên quan hoặc định dạng dữ liệu không đúng");
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

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <MovieHeroBanner movie={movie} />

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column - Poster and Action Buttons */}
        <MoviePoster movie={movie} />

        {/* Right Column - Details */}
        <MovieInfo movie={movie} />
      </div>

      {/* Episodes list for TV Shows */}
      <EpisodeList movie={movie} />
      
      {/* Comment Section */}
      <CommentSection movieId={movie.id} className="mt-8" />
      {/* Related Movies */}
      <RelatedMovies movies={relatedMovies} />

    </div>
  );
} 