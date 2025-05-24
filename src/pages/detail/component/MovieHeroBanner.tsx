import type { MovieDetail } from "@/types/movie";

interface MovieHeroBannerProps {
  movie: MovieDetail;
}

export function MovieHeroBanner({ movie }: MovieHeroBannerProps) {
  return (
    <div className="relative -mx-4 -mt-6 h-[50vh] min-h-[300px] md:h-[60vh]">
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: `url(${movie.thumbUrl || movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>
    </div>
  );
} 