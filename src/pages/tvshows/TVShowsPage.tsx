import { useState, useEffect } from "react";
import { MovieCard } from "@/components/ui/movie-card";
import { mockTVShows } from "@/lib/mock-data";
import type { TVShow } from "@/types/movie";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function TVShowsPage() {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [filteredTVShows, setFilteredTVShows] = useState<TVShow[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("latest");

  useEffect(() => {
    // Get only TV shows
    const tvShowsOnly = mockTVShows.filter(show => show.type === 'tv');
    setTVShows(tvShowsOnly);
    setFilteredTVShows(tvShowsOnly);
  }, []);

  useEffect(() => {
    let result = [...tvShows];
    
    // Filter by genre
    if (selectedGenre !== "all") {
      result = result.filter(show => 
        show.genres.some(genre => genre.id === selectedGenre)
      );
    }
    
    // Filter by country
    if (selectedCountry !== "all") {
      result = result.filter(show => 
        show.country.toLowerCase() === selectedCountry.toLowerCase()
      );
    }
    
    // Sort results
    switch (selectedSort) {
      case "latest":
        result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    setFilteredTVShows(result);
  }, [tvShows, selectedGenre, selectedCountry, selectedSort]);

  // Get unique countries from TV shows for the filter
  const countries = [...new Set(tvShows.map(show => show.country))].sort();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Phim Bộ</h1>
        <p className="text-muted-foreground">
          Danh sách phim bộ mới nhất, chất lượng cao, vietsub, thuyết minh
        </p>
      </div>
      
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <Tabs defaultValue="all" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger 
              value="all" 
              onClick={() => setSelectedGenre("all")}
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger 
              value="drama" 
              onClick={() => setSelectedGenre("drama")}
            >
              Chính Kịch
            </TabsTrigger>
            <TabsTrigger 
              value="romance" 
              onClick={() => setSelectedGenre("romance")}
            >
              Tình Cảm
            </TabsTrigger>
            <TabsTrigger 
              value="action" 
              onClick={() => setSelectedGenre("action")}
            >
              Hành Động
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center space-x-2">
          <Select
            value={selectedCountry}
            onValueChange={setSelectedCountry}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Quốc gia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {countries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedSort}
            onValueChange={setSelectedSort}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
              <SelectItem value="rating">Xếp hạng</SelectItem>
              <SelectItem value="name">Tên A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      {filteredTVShows.length === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-muted-foreground">Không tìm thấy phim nào phù hợp với bộ lọc.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredTVShows.map((show) => (
            <MovieCard key={show.id} movie={show} />
          ))}
        </div>
      )}
    </div>
  );
} 