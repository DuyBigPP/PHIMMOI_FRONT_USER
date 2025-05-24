import axios from 'axios';
import {
  CREATE_COMMENT,
  GET_COMMENT_BY_MOVIE_ID,
  DELETE_COMMENT,
  GET_MOVIE_LIST,
  GET_MOVIE_BY_SLUG,
  CREATE_RATING,
  GET_RATING_BY_MOVIE_ID,
  DELETE_RATING,
  GET_POPULAR_MOVIE,
  GET_RELATED_MOVIE,
  CREATE_VIEW,
  REGISTER,
  LOGIN,
  GET_USER_INFO,
  GET_USER_FAVORITE,
  ADD_FAVORITE,
  DELETE_FAVORITE
} from './endpoint';
import {
  ApiResponse,
  MovieListParams,
  MovieListResponse,
  Comment,
  CommentListResponse,
  Rating,
  RatingListResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  Favorite,
  FavoriteListResponse
} from '../types/api';

// Comment API functions
export const createComment = async (movieId: string, content: string): Promise<ApiResponse<Comment>> => {
  const response = await axios.post(CREATE_COMMENT.replace('{movieId}', movieId), { content });
  return response.data;
};

export const getCommentsByMovieId = async (
  movieId: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<CommentListResponse>> => {
  const response = await axios.get(GET_COMMENT_BY_MOVIE_ID.replace('{movieId}', movieId), {
    params: { page, limit }
  });
  return response.data;
};

export const deleteComment = async (commentId: string): Promise<ApiResponse<void>> => {
  const response = await axios.delete(DELETE_COMMENT.replace('{commentId}', commentId));
  return response.data;
};

// Movie API functions
export const getMovieList = async (params: MovieListParams): Promise<ApiResponse<MovieListResponse>> => {
  const response = await axios.get(GET_MOVIE_LIST, { params });
  return response.data;
};

export const getMovieBySlug = async (slug: string): Promise<ApiResponse<MovieListResponse>> => {
  const response = await axios.get(GET_MOVIE_BY_SLUG.replace('{slug}', slug));
  return response.data;
};

// Rating API functions
export const createRating = async (
  movieId: string,
  score: number,
  review: string
): Promise<ApiResponse<Rating>> => {
  const response = await axios.post(CREATE_RATING.replace('{movieId}', movieId), { score, review });
  return response.data;
};

export const getRatingsByMovieId = async (
  movieId: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<RatingListResponse>> => {
  const response = await axios.get(GET_RATING_BY_MOVIE_ID.replace('{movieId}', movieId), {
    params: { page, limit }
  });
  return response.data;
};

export const deleteRating = async (ratingId: string): Promise<ApiResponse<void>> => {
  const response = await axios.delete(DELETE_RATING.replace('{ratingId}', ratingId));
  return response.data;
};

// Recommendation API functions
export const getPopularMovies = async (
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<MovieListResponse>> => {
  const response = await axios.get(GET_POPULAR_MOVIE, { params: { page, limit } });
  return response.data;
};

export const getRelatedMovies = async (
  movieId: string,
  limit: number = 10
): Promise<ApiResponse<MovieListResponse>> => {
  const response = await axios.get(GET_RELATED_MOVIE.replace('{movieId}', movieId), {
    params: { limit }
  });
  return response.data;
};

// View API functions
export const createView = async (movieId: string): Promise<ApiResponse<void>> => {
  const response = await axios.post(CREATE_VIEW.replace('{movieId}', movieId));
  return response.data;
};

// Auth API functions
export const register = async (data: RegisterRequest): Promise<AuthResponse | ApiResponse<AuthResponse>> => {
  console.log('Calling register API with data:', data);
  try {
    const response = await axios.post(REGISTER, data);
    console.log('Register API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Register API error:', error);
    // Check if the error has a response with data that might be useful
    if (axios.isAxiosError(error) && error.response?.data) {
      console.log('Register API error details:', error.response.data);
    }
    throw error;
  }
};

export const login = async (data: LoginRequest): Promise<AuthResponse | ApiResponse<AuthResponse>> => {
  console.log('Calling login API with data:', data);
  try {
    const response = await axios.post(LOGIN, data);
    console.log('Login API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    // Check if the error has a response with data that might be useful
    if (axios.isAxiosError(error) && error.response?.data) {
      console.log('Login API error details:', error.response.data);
    }
    throw error;
  }
};

export const getUserInfo = async (): Promise<User | ApiResponse<User>> => {
  console.log('Calling getUserInfo API');
  try {
    const response = await axios.get(GET_USER_INFO);
    console.log('GetUserInfo API response:', response.data);
    
    // Kiểm tra nếu response.data có cấu trúc của một ApiResponse
    if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
      return response.data as ApiResponse<User>;
    }
    
    // Nếu không, coi như response.data chính là User object
    return response.data as User;
  } catch (error) {
    console.error('GetUserInfo API error:', error);
    throw error;
  }
};

// Favorite API functions
export const getUserFavorite = async (): Promise<ApiResponse<FavoriteListResponse>> => {
  const response = await axios.get(GET_USER_FAVORITE);
  return response.data;
};

export const addFavorite = async (movieId: string): Promise<ApiResponse<Favorite>> => {
  const response = await axios.post(ADD_FAVORITE, { movieId });
  return response.data;
};

export const deleteFavorite = async (movieId: string): Promise<ApiResponse<void>> => {
  const response = await axios.delete(DELETE_FAVORITE.replace('{movieId}', movieId));
  return response.data;
};





