import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { mockMovies, mockTVShows } from "@/lib/mock-data";
import type { Movie } from "@/types/movie";
import { MovieCard } from "@/components/ui/movie-card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock actor data
const mockActors = [
  {
    id: "tom-holland",
    name: "Tom Holland",
    image: "https://media.voocdn.com/media/image/id/647a2222acc39996228b45e4_720x",
    bio: "Thomas Stanley Holland là một diễn viên người Anh. Một sinh viên tốt nghiệp trường Nghệ thuật Biểu diễn BRIT, anh đã bắt đầu sự nghiệp diễn xuất của mình trên sân khấu trong vai chính của vở nhạc kịch Billy Elliot tại Nhà hát Victoria Palace ở West End từ năm 2008 đến năm 2010.",
  },
  {
    id: "robert-downey-jr",
    name: "Robert Downey Jr.",
    image: "https://media.voocdn.com/media/image/id/647a22a2acc39996228b45f2_720x",
    bio: "Robert John Downey Jr. là một nam diễn viên và nhà sản xuất người Mỹ. Sự nghiệp của anh được đánh dấu bởi thành công quan trọng về cả nghệ thuật lẫn thương mại ở tuổi trẻ, sau đó là một thời gian bị lạm dụng chất kích thích và các vấn đề pháp lý, và sự hồi sinh thương mại vào tuổi trung niên.",
  },
];

export default function ActorPage() {
  const { actorId } = useParams<{ actorId: string }>();
  const [actor, setActor] = useState<typeof mockActors[0] | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (actorId) {
      setLoading(true);
      
      // Find actor by ID (in a real app, this would be an API call)
      const foundActor = mockActors.find((a) => a.id === actorId);
      setActor(foundActor || null);
      
      // Get random movies to simulate actor filmography
      // In a real app, this would be an API call to get movies by actor ID
      const allMedia = [...mockMovies, ...mockTVShows];
      const randomMovies = allMedia
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);
      
      setMovies(randomMovies);
      setLoading(false);
    }
  }, [actorId]);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!actor) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-2">Diễn viên không tồn tại</h1>
        <p className="text-muted-foreground">
          Diễn viên bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <Avatar className="h-48 w-48 rounded-md">
            <AvatarImage src={actor.image} alt={actor.name} />
            <AvatarFallback>{actor.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{actor.name}</h1>
          <p className="text-muted-foreground mb-4">Diễn viên</p>
          <p>{actor.bio}</p>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Phim đã tham gia</h2>
        
        {movies.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Không tìm thấy phim nào của diễn viên này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 