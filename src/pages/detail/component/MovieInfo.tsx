import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Star, Globe, FileText } from "lucide-react";
import type { MovieDetail } from "@/types/movie";

interface MovieInfoProps {
  movie: MovieDetail;
  className?: string;
}

export function MovieInfo({ movie, className }: MovieInfoProps) {
  const hasRating = movie.tmdbVoteAverage && movie.tmdbVoteAverage > 0;
  const isMobile = className?.includes('mobile-info');
  
  if (isMobile) {
    // Mobile version - compact side layout
    return (
      <div className="space-y-4">
        {/* Title Section */}
        <div>
          <h1 className="text-xl font-bold leading-tight">{movie.name}</h1>
          {movie.originName && movie.originName !== movie.name && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{movie.originName}</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {hasRating && (
            <div className="flex items-center bg-yellow-500/10 px-2 py-1 rounded">
              <Star className="mr-1 h-3 w-3 text-yellow-400" />
              <span className="font-medium text-xs">{movie.tmdbVoteAverage.toFixed(1)}</span>
            </div>
          )}
          <div className="flex items-center bg-muted px-2 py-1 rounded">
            <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
            <span className="text-xs">{movie.year}</span>
          </div>
          {movie.time && (
            <div className="flex items-center bg-muted px-2 py-1 rounded">
              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
              <span className="text-xs">{movie.time}</span>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {movie.categories && movie.categories.slice(0, 3).map((cat) => (
            <Badge 
              key={cat.category.id} 
              variant="secondary"
              className="text-xs px-2 py-0.5"
            >
              {cat.category.name}
            </Badge>
          ))}
          {movie.categories && movie.categories.length > 3 && (
            <Badge 
              variant="secondary"
              className="text-xs px-2 py-0.5"
            >
              +{movie.categories.length - 3}
            </Badge>
          )}
        </div>

        {/* Content Preview */}
        {movie.content && (
          <div>
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {movie.content}
            </p>
          </div>
        )}

        {/* Countries */}
        {movie.countries && movie.countries.length > 0 && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Globe className="mr-1 h-3 w-3" />
            <span className="text-xs">{movie.countries.map(c => c.country.name).join(', ')}</span>
          </div>
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl xl:text-4xl">{movie.name}</h1>
        {movie.originName && movie.originName !== movie.name && (
          <p className="mt-2 text-lg text-muted-foreground lg:text-xl">{movie.originName}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {hasRating && (
          <div className="flex items-center">
            <Star className="mr-2 h-5 w-5 text-yellow-400" />
            <span className="text-lg font-medium">{movie.tmdbVoteAverage.toFixed(1)}</span>
          </div>
        )}
        <div className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
          <span>{movie.year}</span>
        </div>
        {movie.time && (
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
            <span>{movie.time}</span>
          </div>
        )}
        {movie.countries && movie.countries.length > 0 && (
          <div className="flex items-center">
            <Globe className="mr-2 h-5 w-5 text-muted-foreground" />
            <span>{movie.countries.map(c => c.country.name).join(', ')}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {movie.categories && movie.categories.map((cat) => (
          <Badge 
            key={cat.category.id} 
            variant="secondary"
            className="px-3 py-1"
          >
            {cat.category.name}
          </Badge>
        ))}
      </div>

      <Separator />

      <div>
        <h2 className="flex items-center text-xl font-semibold mb-3">
          <FileText className="mr-2 h-5 w-5" />
          Nội dung phim
        </h2>
        <p className="text-muted-foreground leading-relaxed">{movie.content}</p>
      </div>

      {/* Actors */}
      {movie.actors && movie.actors.length > 0 && (
        <>
          <Separator />
          <div>
            <h2 className="mb-3 text-xl font-semibold">Diễn viên</h2>
            <div className="flex flex-wrap gap-2">
              {movie.actors.slice(0, 10).map((actor) => (
                <Badge key={actor.actor.id} variant="outline">
                  {actor.actor.name}
                </Badge>
              ))}
              {movie.actors.length > 10 && (
                <Badge variant="outline">
                  +{movie.actors.length - 10} diễn viên khác
                </Badge>
              )}
            </div>
          </div>
        </>
      )}

      {/* Directors */}
      {movie.directors && movie.directors.length > 0 && (
        <>
          <Separator />
          <div>
            <h2 className="mb-3 text-xl font-semibold">Đạo diễn</h2>
            <div className="flex flex-wrap gap-2">
              {movie.directors.map((director) => (
                <Badge key={director.director.id} variant="outline">
                  {director.director.name}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 