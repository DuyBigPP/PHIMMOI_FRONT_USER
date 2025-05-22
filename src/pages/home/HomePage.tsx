import { useState, useEffect } from "react";
import { Section } from "@/components/ui/section";
// import { MovieCard } from "@/components/ui/movie-card"; // No longer used
import { MovieCarousel } from "@/components/ui/movie-carousel";
import { FeaturedCarousel } from "@/components/ui/featured-carousel";
import { getPopularMovies, getMovieList } from "@/service/function";
import type { Movie } from "@/types/movie";
import LoadingAnimation from "@/components/common/loading_animation";

export default function HomePage() {
  // const [featuredMedia, setFeaturedMedia] = useState<Movie[]>([]); // No longer used
  const [featuredCarouselMovies, setFeaturedCarouselMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching popular movies...');
        const popularResponse = await getPopularMovies();
        console.log('Popular movies response:', popularResponse);

        if (!popularResponse.success) {
          throw new Error(popularResponse.message || 'Failed to fetch popular movies');
        }

        if (!Array.isArray(popularResponse.data)) {
          console.error('Popular movies data is not an array:', popularResponse.data);
          throw new Error('Invalid data format from popular movies API');
        }

        if (popularResponse.data.length > 0) {
          console.log('First movie structure:', popularResponse.data[0]);
        }

        console.log('Setting featured media...');
        // setFeaturedMedia(popularResponse.data[0]);
        setFeaturedCarouselMovies(popularResponse.data);

        console.log('Fetching trending movies...');
        const trendingResponse = await getMovieList({ type: 'single', sort: 'popular' });
        console.log('Trending movies response:', trendingResponse);

        if (!trendingResponse.success) {
          throw new Error(trendingResponse.message || 'Failed to fetch trending movies');
        }

        if (!trendingResponse.data?.movies) {
          console.error('Trending movies data is missing movies array:', trendingResponse.data);
          throw new Error('Invalid data format from trending movies API');
        }

        if (trendingResponse.data.movies.length > 0) {
          console.log('First trending movie structure:', trendingResponse.data.movies[0]);
        }

        setTrendingMovies(trendingResponse.data.movies);

        console.log('Fetching TV shows...');
        const tvResponse = await getMovieList({ type: 'series', sort: 'popular' });
        console.log('TV shows response:', tvResponse);

        if (!tvResponse.success) {
          throw new Error(tvResponse.message || 'Failed to fetch TV shows');
        }

        if (!tvResponse.data?.movies) {
          console.error('TV shows data is missing movies array:', tvResponse.data);
          throw new Error('Invalid data format from TV shows API');
        }

        if (tvResponse.data.movies.length > 0) {
          console.log('First TV show structure:', tvResponse.data.movies[0]);
        }

        setPopularTVShows(tvResponse.data.movies);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load movie data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <p className="text-lg font-medium mb-2 text-red-500">{error}</p>
        <p className="text-muted-foreground text-center max-w-md">
          Vui lòng kiểm tra kết nối mạng và thử lại sau.
        </p>
      </div>
    );
  }

  if (featuredCarouselMovies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg font-medium mb-2">Không thể tải dữ liệu phim</p>
        <p className="text-muted-foreground text-center max-w-md">
          Vui lòng kiểm tra kết nối mạng và thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Featured Carousel chỉ 1 phim */}
      <div className="-mx-4">
        <FeaturedCarousel movies={featuredCarouselMovies.slice(0, 5)} />
      </div>

      {/* Featured Movies Carousel (nếu cần) */}
      {/* {featuredMedia.length > 0 && (
        <Section title="Phim Đề Xuất" href="/danh-sach">
          <MovieCarousel movies={featuredMedia} className="w-full" />
        </Section>
      )} */}

      {/* Trending Movies */}
      {trendingMovies.length > 0 && (
        <Section title="Phim Lẻ" href="/phim-le">
          <MovieCarousel movies={trendingMovies} className="w-full" />
        </Section>
      )}

      {/* Popular TV Shows */}
      {popularTVShows.length > 0 && (
        <Section title="Phim Bộ" href="/phim-bo">
          <MovieCarousel movies={popularTVShows} className="w-full" />
        </Section>
      )}
    </div>
  );
} 