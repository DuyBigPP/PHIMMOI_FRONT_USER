const BASE_URL = "https://phimmoi-backend.onrender.com";

/* COMMENT */
export const CREATE_COMMENT = `${BASE_URL}/api/movies/{movieId}/comments`; // POST
/* parameters for create comment:
    - movieId: string (path)
    - content: string (body)
*/
export const GET_COMMENT_BY_MOVIE_ID = `${BASE_URL}/api/movies/{movieId}/comments`; // GET
/* parameters for get comment by movie id:
    - movieId: string (path)
    - page: integer (query) default: 1
    - limit: integer (query) default: 10
*/
export const DELETE_COMMENT = `${BASE_URL}/api/comments/{commentId}`; // DELETE
/* parameters for delete comment:
    - commentId: string (path)
*/


/* FAVORITE */
export const GET_USER_FAVORITE = `${BASE_URL}/api/favorites`; // GET
/* parameters for get user favorite: not need any parameters */
export const ADD_FAVORITE = `${BASE_URL}/api/favorites`; // POST
/* parameters for add favorite:
    - movieId: string (body)
*/
export const DELETE_FAVORITE = `${BASE_URL}/api/favorites`; // DELETE
/* parameters for delete favorite:
    - movieId: string (body)
*/



/* MOVIE */
export const GET_MOVIE_LIST = `${BASE_URL}/api/movies`; // GET
/* parameters for get movie list:
    - page: integer (query) default: 1
    - limit: integer (query) default: 10
    - type: string (query) (single, series)
    - category: string (query)
    - country: string (query)
    - year: integer (query) 
    - search: string (query) default: ""
*/
export const GET_MOVIE_BY_SLUG = `${BASE_URL}/api/movies/{slug}`; // GET
/* parameters for get movie by slug:
    - slug: string (path)
*/

/* RATING */
export const CREATE_RATING = `${BASE_URL}/api/movies/{movieId}/ratings`; // POST
/* parameters for create rating:
    - movieId: string (path)
    - score: integer (body)
    - review: string (body)
*/
export const GET_RATING_BY_MOVIE_ID = `${BASE_URL}/api/movies/{movieId}/ratings`; // GET
/* parameters for get rating by movie id:
    - movieId: string (path)
    - page: integer (query) default: 1
    - limit: integer (query) default: 10
*/
export const DELETE_RATING = `${BASE_URL}/api/ratings/{ratingId}`; // DELETE
/* parameters for delete rating:
    - movieId: string (path)
*/

/* RECOMMENDATION */
export const GET_POPULAR_MOVIE = `${BASE_URL}/api/movies/popular`; // GET
/* parameters for get popular movie:
    - page: integer (query) default: 1
    - limit: integer (query) default: 10
*/
export const GET_RELATED_MOVIE = `${BASE_URL}/api/movies/{movieId}/related`; // GET
/* parameters for get related movie:
    - movieId: string (path)
    - limit: integer (query) default: 10
*/

/* VIEW */
export const CREATE_VIEW = `${BASE_URL}/api/movies/{movieId}/view`; // POST
/* parameters for create view:
    - movieId: string (body)
*/

/* AUTH */
export const REGISTER = `${BASE_URL}/api/register`; // POST
/* parameters for register:
    - email: string (body)
    - password: string (body)
    - name: string (body)
*/  
export const LOGIN = `${BASE_URL}/api/login`; // POST
/* parameters for login:
    - email: string (body)
    - password: string (body)
*/
export const GET_USER_INFO = `${BASE_URL}/api/me`; // GET
