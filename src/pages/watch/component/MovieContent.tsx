import { MovieDetail } from "@/types/movie";

interface MovieContentProps {
  movie: MovieDetail;
}

const MovieContent = ({ movie }: MovieContentProps) => {
  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold">Nội dung phim</h2>
      <p className="text-muted-foreground">{movie.content}</p>
    </div>
  );
};

export default MovieContent; 