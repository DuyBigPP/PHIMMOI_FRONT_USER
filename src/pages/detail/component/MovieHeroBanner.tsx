import type { MovieDetail } from "@/types/movie";

interface MovieHeroBannerProps {
  movie: MovieDetail;
  className?: string;
}

export function MovieHeroBanner({ movie, className }: MovieHeroBannerProps) {
  return (
    <div className={`relative w-full h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden ${className}`}>
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: `url(${movie.thumbUrl || movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%'
        }}
      >
        {/* Simple gradient overlay for better visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>
    </div>
  );
}