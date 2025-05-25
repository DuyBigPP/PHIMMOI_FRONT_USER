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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && hasMultiple) {
      goToNext();
    }
    if (isRightSwipe && hasMultiple) {
      goToPrev();
    }
  };

  if (!movies || movies.length === 0) return null;

  const movie = movies[currentIndex];

  return (
    <div 
      className={cn(
        "relative group w-screen overflow-hidden featured-carousel",
        // Better responsive heights that prevent cropping
        "h-[50vh] min-h-[300px]", // Mobile: taller minimum height
        "sm:h-[60vh] sm:min-h-[350px]", // Small screens
        "md:h-[65vh] md:min-h-[400px]", // Medium screens
        "lg:h-[70vh] lg:min-h-[450px]", // Large screens
        "xl:h-[75vh] xl:min-h-[500px]", // Extra large screens
        "2xl:h-[80vh] 2xl:min-h-[600px]", // 2x large screens
        className
      )}
      onKeyDownCapture={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
          className="absolute inset-0 w-full h-full"
        >
          {/* Background image with full screen coverage */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat carousel-bg-image"
            style={{ 
              backgroundImage: `url(${movie.thumbUrl || movie.posterUrl || movie.poster})`,
            }}
          >
            {/* Hidden image for better loading */}
            <img
              src={movie.thumbUrl || movie.posterUrl || movie.poster}
              alt={movie.name || 'Movie background'}
              className="w-full h-full object-cover object-center opacity-0"
              loading="eager"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          {/* Enhanced gradient overlays for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
          
          <div className="absolute inset-0 flex items-end">
            <div className="w-full p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
              {/* Content container with responsive width and visibility */}
              <div className="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
                {/* Title - Always visible but responsive sizing */}
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white carousel-text-shadow leading-tight">
                  {movie.name || 'Không có tiêu đề'}
                </h1>
                
                {/* Original name - Hide on small screens */}
                {movie.originName && movie.originName !== movie.name && (
                  <p className="hidden sm:block mt-1 sm:mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-white/90 carousel-text-shadow line-clamp-1">
                    {movie.originName}
                  </p>
                )}
                
                {/* Movie info - Progressive enhancement for larger screens */}
                <div className="mt-2 sm:mt-3 md:mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-white/90 text-xs sm:text-sm md:text-base">
                  <span className="bg-yellow-500 rounded px-2 py-1 font-semibold whitespace-nowrap">
                    ★ {(movie.rating || 0).toFixed(1)}
                  </span>
                  <span className="hidden sm:inline">|</span>
                  <span className="whitespace-nowrap">{movie.year || 'N/A'}</span>
                  <span className="hidden sm:inline">|</span>
                  <span className="hidden sm:inline whitespace-nowrap">{movie.quality || 'HD'}</span>
                  <span className="hidden md:inline">|</span>
                  <span className="hidden md:inline whitespace-nowrap">
                    {movie.time || (movie.duration ? `${movie.duration} phút` : 'N/A')}
                  </span>
                </div>

                {/* Description - Hide on mobile, show progressively */}
                <p className="hidden md:block mt-3 md:mt-4 lg:mt-5 text-white/90 carousel-text-shadow text-sm md:text-base lg:text-lg line-clamp-2 lg:line-clamp-3">
                  {movie.content || movie.description || 'Không có mô tả'}
                </p>

                {/* Buttons - Fixed size across all screens */}
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
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators - responsive positioning */}
      {hasMultiple && (
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-20">
          {movies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "rounded-full transition-all",
                "w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3", // Better responsive dot sizing
                idx === currentIndex 
                  ? "bg-primary w-3 sm:w-4 md:w-5 lg:w-6" 
                  : "bg-white/60 hover:bg-white/90"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Arrow buttons - responsive sizing and positioning */}
      {hasMultiple && (
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 right-4 sm:right-6 md:right-8 lg:right-10 flex space-x-2 z-20">
          <button
            className="flex items-center justify-center bg-black/70 hover:bg-primary/80 rounded-full border border-white/30 shadow-lg transition-all w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11"
            onClick={goToPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          </button>
          <button
            className="flex items-center justify-center bg-black/70 hover:bg-primary/80 rounded-full border border-white/30 shadow-lg transition-all w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}