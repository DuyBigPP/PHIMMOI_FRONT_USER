import React from "react";
import { MovieCard } from "@/components/ui/movie-card";
import type { Movie } from "@/types/movie";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

interface MovieCarouselProps {
  movies: Movie[];
  className?: string;
}

function getSlidesToShow() {
  if (typeof window !== "undefined") {
    if (window.innerWidth >= 1280) return 6;
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 768) return 3;
    return 2;
  }
  return 6;
}

export function MovieCarousel({ movies, className }: MovieCarouselProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = React.useState(0);
  const [slidesToShow, setSlidesToShow] = React.useState(getSlidesToShow());
  const [currentIndex, setCurrentIndex] = React.useState(slidesToShow); // bắt đầu sau clone đầu
  const [isPaused, setIsPaused] = React.useState(false);
  const controls = useAnimation();

  const gap = 16;

  // Tính lại kích thước item
  React.useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const total = containerRef.current.offsetWidth;
        setItemWidth((total - gap * (slidesToShow - 1)) / slidesToShow);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [slidesToShow]);

  // Responsive
  React.useEffect(() => {
    const handleResize = () => setSlidesToShow(getSlidesToShow());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Clone dữ liệu đầu/cuối
  const extendedMovies = [
    ...movies.slice(-slidesToShow),
    ...movies,
    ...movies.slice(0, slidesToShow),
  ];

  const totalItems = extendedMovies.length;

  // Auto play
  React.useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        goTo(currentIndex + 1);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isPaused]);

  // Animate chuyển slide
  const goTo = async (index: number) => {
    await controls.start({
      x: -index * (itemWidth + gap),
      transition: { duration: 0.5, ease: "easeInOut" },
    });
    setCurrentIndex(index);
  };

  // Sau khi animation tới clone → reset về thật
  React.useEffect(() => {
    if (currentIndex >= movies.length + slidesToShow) {
      // cuối clone
      const timeout = setTimeout(() => {
        controls.set({
          x: -slidesToShow * (itemWidth + gap),
        });
        setCurrentIndex(slidesToShow);
      }, 510);
      return () => clearTimeout(timeout);
    } else if (currentIndex < slidesToShow) {
      // đầu clone
      const timeout = setTimeout(() => {
        controls.set({
          x: -(movies.length + slidesToShow - 1) * (itemWidth + gap),
        });
        setCurrentIndex(movies.length + slidesToShow - 1);
      }, 510);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, controls, itemWidth]);

  const prev = () => goTo(currentIndex - 1);
  const next = () => goTo(currentIndex + 1);

  return (
    <div
      className={cn("relative w-full", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div ref={containerRef} className="overflow-hidden px-2">
        <motion.div
          className="flex gap-4"
          animate={controls}
          style={{ width: totalItems * (itemWidth + gap) }}
        >
          {extendedMovies.map((movie, index) => (
            <div
              key={`${movie.id}-${index}`}
              className="flex-none"
              style={{ width: itemWidth }}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </motion.div>
      </div>

      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-16 md:w-12 md:h-20 bg-black/70 hover:bg-primary/80 rounded-r-md text-white"
      >
        <ChevronLeft className="w-7 h-7 md:w-9 md:h-9 mx-auto" />
      </button>

      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-16 md:w-12 md:h-20 bg-black/70 hover:bg-primary/80 rounded-l-md text-white"
      >
        <ChevronRight className="w-7 h-7 md:w-9 md:h-9 mx-auto" />
      </button>
    </div>
  );
}
