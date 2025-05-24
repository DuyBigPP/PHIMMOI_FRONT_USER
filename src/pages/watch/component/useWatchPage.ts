import { useState, useEffect, useMemo } from "react";
import { getMovieBySlug } from "@/service/function";
import { MovieDetail, MovieEpisode } from "@/types/movie";

export const useWatchPage = (slug?: string, episodeSlug?: string) => {
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

  return {
    movie,
    currentEpisode,
    loading,
    error
  };
}; 