import { Movie, TVShow, /* Genre, Actor  */} from './movie';

// Common response type
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Pagination type
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Movie list response
export interface MovieListResponse {
  movies: (Movie | TVShow)[];
  pagination: Pagination;
}

// Movie list params
export interface MovieListParams {
  page?: number;
  limit?: number;
  type?: 'single' | 'series';
  category?: string;
  country?: string;
  year?: number;
  search?: string;
  sort?: 'latest' | 'popular' | 'rating';
}

// Comment types
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  movieId: string;
}

export interface CommentListResponse {
  comments: Comment[];
  pagination: Pagination;
}

// Rating types
export interface Rating {
  id: string;
  score: number;
  review: string;
  userId: string;
  movieId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface RatingListResponse {
  ratings: Rating[];
  averageScore: number;
  pagination: Pagination;
}

// Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
} 

// Favorite types
export interface Favorite {
  id: string;
  movieId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteListResponse {
  favorites: Favorite[];
  pagination: Pagination;
}
