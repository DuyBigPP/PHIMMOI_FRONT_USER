import { useState, useEffect, useRef } from "react";
import { Section } from "@/components/ui/section";
import { MovieCarousel } from "@/components/ui/movie-carousel";
import { FeaturedCarousel } from "@/components/ui/featured-carousel";
import { getPopularMovies, getMovieList } from "@/service/function";
import type { Movie } from "@/types/movie";
import LoadingAnimation from "@/components/common/loading_animation";
import { MovieSection } from "@/components/sections/MovieSection";

export default function HomePage() {
  const [featuredCarouselMovies, setFeaturedCarouselMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    // Tránh fetch dữ liệu nhiều lần trong development mode với React.StrictMode
    if (dataFetchedRef.current) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch popular movies
        const popularResponse = await getPopularMovies();

        if (!popularResponse.success) {
          throw new Error(popularResponse.message || 'Failed to fetch popular movies');
        }

        // API có thể trả về dữ liệu theo nhiều cách khác nhau
        let popularMovies: Movie[] = [];
        if (Array.isArray(popularResponse.data)) {
          popularMovies = popularResponse.data;
        } else if (popularResponse.data?.movies && Array.isArray(popularResponse.data.movies)) {
          popularMovies = popularResponse.data.movies;
        } else {
          console.warn('Unexpected popular movies data structure:', popularResponse.data);
          popularMovies = [];
        }

        setFeaturedCarouselMovies(popularMovies.slice(0, 5));

        // Fetch trending movies
        const trendingResponse = await getMovieList({ type: 'single', sort: 'popular' });

        if (!trendingResponse.success) {
          throw new Error(trendingResponse.message || 'Failed to fetch trending movies');
        }

        // Kiểm tra cấu trúc dữ liệu trả về
        let trendingMoviesData: Movie[] = [];
        if (trendingResponse.data?.movies && Array.isArray(trendingResponse.data.movies)) {
          trendingMoviesData = trendingResponse.data.movies;
        } else {
          console.warn('Unexpected trending movies data structure:', trendingResponse.data);
          trendingMoviesData = [];
        }

        setTrendingMovies(trendingMoviesData);

        // Fetch TV shows
        const tvResponse = await getMovieList({ type: 'series', sort: 'popular' });

        if (!tvResponse.success) {
          throw new Error(tvResponse.message || 'Failed to fetch TV shows');
        }

        // Kiểm tra cấu trúc dữ liệu trả về
        let tvShowsData: Movie[] = [];
        if (tvResponse.data?.movies && Array.isArray(tvResponse.data.movies)) {
          tvShowsData = tvResponse.data.movies;
        } else {
          console.warn('Unexpected TV shows data structure:', tvResponse.data);
          tvShowsData = [];
        }

        setPopularTVShows(tvShowsData);
        dataFetchedRef.current = true;
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
    <>
      {/* Featured Carousel - Full width, outside container */}
      <FeaturedCarousel movies={featuredCarouselMovies} />
      
      {/* Main content with container */}
      <div className="container mx-auto px-4 space-y-6 md:space-y-8 mt-6 md:mt-8">
        {/* Trending Movies - Desktop */}
        <div className="hidden md:block">
          {trendingMovies.length > 0 && (
            <Section title="Phim Lẻ" href="/phim-le">
              <MovieCarousel movies={trendingMovies} className="w-full" />
            </Section>
          )}
        </div>

        {/* Trending Movies - Mobile */}
        <div className="md:hidden">
          {trendingMovies.length > 0 && (
            <MovieSection 
              title="Phim Lẻ" 
              viewAllHref="/phim-le" 
              movies={trendingMovies.slice(0, 6)} 
            />
          )}
        </div>

        {/* Popular TV Shows - Desktop */}
        <div className="hidden md:block">
          {popularTVShows.length > 0 && (
            <Section title="Phim Bộ" href="/phim-bo">
              <MovieCarousel movies={popularTVShows} className="w-full" />
            </Section>
          )}
        </div>

        {/* Popular TV Shows - Mobile */}
        <div className="md:hidden">
          {popularTVShows.length > 0 && (
            <MovieSection 
              title="Phim Bộ" 
              viewAllHref="/phim-bo" 
              movies={popularTVShows.slice(0, 6)} 
            />
          )}
        </div>
      </div>
    </>
  );
}