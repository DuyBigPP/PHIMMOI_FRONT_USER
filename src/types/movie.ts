export interface Movie {
  id: string;
  name: string;
  slug: string;
  originName: string;
  type: string;
  posterUrl: string;
  thumbUrl?: string;
  content: string;
  year: number;
  time: string;
  quality?: string;
  status?: string;
  trailerUrl?: string;
  categories: Array<{
    category: {
      id: string;
      name: string;
      slug: string;
    }
  }>;
  countries: Array<{
    country: {
      id: string;
      name: string;
      slug: string;
    }
  }>;
  // Old fields for backward compatibility
  poster?: string;
  description?: string;
  duration?: number;
  rating?: number;
  backdrop?: string;
}

export interface TVShow extends Movie {
  type: 'tv';
  seasons: Season[];
  episodes?: Episode[];
  currentEpisode?: number;
  currentSeason?: number;
}

export interface Season {
  id: string;
  name: string;
  seasonNumber: number;
  episodeCount: number;
  overview?: string;
  poster?: string;
}

export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  seasonNumber: number;
  overview?: string;
  still?: string;
  runtime?: number;
  releaseDate?: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface Actor {
  id: string;
  name: string;
  character?: string;
  profile?: string;
}

export type MediaType = 'movie' | 'tv';

export interface Filter {
  genre?: string;
  year?: string;
  country?: string;
  sort?: 'latest' | 'popular' | 'rating';
} 