import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Movie } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface FeaturedCarouselProps {
  movies: Movie[];
  className?: string;
  autoplaySpeed?: number;
}

export function FeaturedCarousel({ 
  movies, 
  className,
  autoplaySpeed = 5000 
}: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Đảm bảo luôn có nhiều hơn 1 phim để test
  const hasMultiple = movies.length > 1;

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  }, [movies.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  }, [movies.length]);

  // Autoplay functionality
  useEffect(() => {
    if (!isPaused && hasMultiple) {
      const interval = setInterval(goToNext, autoplaySpeed);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isPaused, hasMultiple, goToNext, autoplaySpeed]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    },
    [goToPrev, goToNext]
  );

  if (!movies || movies.length === 0) return null;

  const movie = movies[currentIndex];

  return (
    <div 
      className={cn("relative group w-full h-[100vh] min-h-[400px] max-h-[600px]", className)}
      style={{ width: '100vw'}}
      onKeyDownCapture={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      tabIndex={0}
    >
      {/* Slide */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${movie.thumbUrl || movie.posterUrl || movie.poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-background/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 flex items-end md:items-center">
            <div className="w-full md:w-1/2 p-8 md:p-16">
              <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">{movie.name || 'Không có tiêu đề'}</h1>
              {movie.originName && movie.originName !== movie.name && (
                <p className="mt-2 text-lg text-white/80">{movie.originName}</p>
              )}
              <div className="mt-4 flex items-center space-x-3 text-white/90">
                <span className="bg-yellow-500 rounded px-2 py-1 text-sm font-semibold">★ {(movie.rating || 0).toFixed(1)}</span>
                <span>|</span>
                <span>{movie.year || 'N/A'}</span>
                <span>|</span>
                <span>{movie.quality || 'HD'}</span>
                <span>|</span>
                <span>{movie.time || (movie.duration ? `${movie.duration} phút` : 'N/A')}</span>
              </div>
              <p className="mt-4 text-white/90 line-clamp-3 md:line-clamp-4">{movie.content || movie.description || 'Không có mô tả'}</p>
              <div className="mt-6 flex space-x-4">
                <Button asChild size="lg">
                  <Link to={`/xem-phim/${movie.slug}`} className="flex items-center">
                    <Play className="mr-2 h-5 w-5" />
                    Xem Phim
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link to={`/phim/${movie.slug}`}>Chi Tiết</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Dot indicators */}
      {hasMultiple && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {movies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                idx === currentIndex ? "bg-primary w-5" : "bg-white/50 hover:bg-white/90"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
      {/* Small arrow buttons at bottom right */}
      {hasMultiple && (
        <div className="absolute bottom-6 right-6 flex space-x-2 z-20">
          <button
            className="w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-primary/80 rounded-full border border-white/20 shadow transition-all"
            onClick={goToPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-primary/80 rounded-full border border-white/20 shadow transition-all"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
} 