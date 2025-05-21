import React from "react";
import { MovieCard } from "@/components/ui/movie-card";
import type { Movie } from "@/types/movie";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MovieCarouselProps {
  movies: Movie[];
  className?: string;
}

function getSlidesToShow() {
  if (typeof window !== 'undefined') {
    if (window.innerWidth >= 1280) return 6; // xl
    if (window.innerWidth >= 1024) return 4; // lg
    if (window.innerWidth >= 768) return 3; // md
    return 2; // sm
  }
  return 6;
}

export function MovieCarousel({ movies, className }: MovieCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [slidesToShow, setSlidesToShow] = React.useState(getSlidesToShow());
  const [isPaused, setIsPaused] = React.useState(false);
  const [direction, setDirection] = React.useState(1); // 1: next, -1: prev

  React.useEffect(() => {
    function handleResize() {
      setSlidesToShow(getSlidesToShow());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Autoplay
  React.useEffect(() => {
    if (!isPaused && movies.length > slidesToShow) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + slidesToShow) % movies.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPaused, movies.length, slidesToShow]);

  const goToPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - slidesToShow + movies.length) % movies.length);
  };
  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + slidesToShow) % movies.length);
  };

  // Get movies for current slide
  const visibleMovies = movies.slice(currentIndex, currentIndex + slidesToShow).length === slidesToShow
    ? movies.slice(currentIndex, currentIndex + slidesToShow)
    : [...movies.slice(currentIndex), ...movies.slice(0, slidesToShow - (movies.length - currentIndex))];

  if (!movies || movies.length === 0) return null;

  return (
    <div
      className={cn("relative w-full", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-full px-2 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 120 : -120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -120 : 120 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex gap-4"
          >
            {visibleMovies.map((movie) => (
              <div key={movie.id} className="flex-1 min-w-0 transition-all">
                <MovieCard movie={movie} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      {movies.length > slidesToShow && (
        <>
          <button
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-16 md:w-12 md:h-20 bg-black/70 hover:bg-primary/80 transition-all rounded-r-md opacity-80 group-hover:opacity-100",
            )}
            onClick={goToPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-7 h-7 md:w-9 md:h-9 text-white mx-auto" />
          </button>
          <button
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-16 md:w-12 md:h-20 bg-black/70 hover:bg-primary/80 transition-all rounded-l-md opacity-80 group-hover:opacity-100",
            )}
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className="w-7 h-7 md:w-9 md:h-9 text-white mx-auto" />
          </button>
        </>
      )}
    </div>
  );
} 