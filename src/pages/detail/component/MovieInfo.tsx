import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Star, Globe, FileText } from "lucide-react";
import type { MovieDetail } from "@/types/movie";

interface MovieInfoProps {
  movie: MovieDetail;
}

export function MovieInfo({ movie }: MovieInfoProps) {
  const hasRating = movie.tmdbVoteAverage && movie.tmdbVoteAverage > 0;

  return (
    <div className="md:col-span-2">
      <h1 className="text-3xl font-bold md:text-4xl">{movie.name}</h1>
      {movie.originName && movie.originName !== movie.name && (
        <p className="mt-2 text-xl text-muted-foreground">{movie.originName}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4">
        {hasRating && (
          <div className="flex items-center">
            <Star className="mr-1 h-5 w-5 text-yellow-400" />
            <span className="font-medium">{movie.tmdbVoteAverage.toFixed(1)}</span>
          </div>
        )}
        <div className="flex items-center">
          <Calendar className="mr-1 h-5 w-5 text-muted-foreground" />
          <span>{movie.year}</span>
        </div>
        {movie.time && (
          <div className="flex items-center">
            <Clock className="mr-1 h-5 w-5 text-muted-foreground" />
            <span>{movie.time}</span>
          </div>
        )}
        {movie.countries && movie.countries.length > 0 && (
          <div className="flex items-center">
            <Globe className="mr-1 h-5 w-5 text-muted-foreground" />
            <span>{movie.countries.map(c => c.country.name).join(', ')}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {movie.categories && movie.categories.map((cat) => (
          <Badge 
            key={cat.category.id} 
            variant="secondary"
            className="rounded-md px-2.5 py-1"
          >
            {cat.category.name}
          </Badge>
        ))}
      </div>

      <Separator className="my-4" />

      <div>
        <h2 className="flex items-center text-xl font-semibold">
          <FileText className="mr-2 h-5 w-5" />
          Nội dung phim
        </h2>
        <p className="mt-2 text-muted-foreground">{movie.content}</p>
      </div>

      {/* Actors */}
      {movie.actors && movie.actors.length > 0 && (
        <>
          <Separator className="my-4" />
          <div>
            <h2 className="mb-3 text-xl font-semibold">Diễn viên</h2>
            <div className="flex flex-wrap gap-2">
              {movie.actors.slice(0, 10).map((actor) => (
                <Badge key={actor.actor.id} variant="outline" className="text-sm">
                  {actor.actor.name}
                </Badge>
              ))}
              {movie.actors.length > 10 && (
                <Badge variant="outline" className="text-sm">
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
          <Separator className="my-4" />
          <div>
            <h2 className="mb-3 text-xl font-semibold">Đạo diễn</h2>
            <div className="flex flex-wrap gap-2">
              {movie.directors.map((director) => (
                <Badge key={director.director.id} variant="outline" className="text-sm">
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