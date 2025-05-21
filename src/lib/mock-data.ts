import type { Movie, TVShow, Genre } from "@/types/movie";

// Mock genres
export const genres: Genre[] = [
  { id: "action", name: "Hành Động" },
  { id: "romance", name: "Tình Cảm" },
  { id: "comedy", name: "Hài Hước" },
  { id: "horror", name: "Kinh Dị" },
  { id: "scifi", name: "Viễn Tưởng" },
  { id: "drama", name: "Chính Kịch" },
  { id: "adventure", name: "Phiêu Lưu" },
  { id: "fantasy", name: "Thần Thoại" },
  { id: "animation", name: "Hoạt Hình" },
  { id: "historical", name: "Cổ Trang" },
];

// Mock movies
export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Kẻ Săn Mộ: Hộp Đựng Ác Quỷ",
    originalTitle: "The Mummy: The Devil's Chest",
    poster: "https://media.voocdn.com/media/image/id/647a2222acc39996228b45e4_720x",
    backdrop: "https://picsum.photos/id/29/1920/1080",
    overview: "Bộ phim kể về một đội khảo cổ của Anh đã phát hiện ra một ngôi mộ cổ của Ai Cập từ thời cổ đại. Họ đã vô tình thức tỉnh một xác ướp đã bị nguyền rủa trong nhiều thế kỷ. Đây là một vị nữ hoàng Ai Cập, và giờ đây nữ hoàng đã hồi sinh với sức mạnh phi thường với kế hoạch trả thù loài người.",
    releaseDate: "2023-12-15",
    runtime: 120,
    rating: 7.2,
    genres: [
      { id: "action", name: "Hành Động" },
      { id: "adventure", name: "Phiêu Lưu" },
      { id: "fantasy", name: "Thần Thoại" }
    ],
    language: "vi",
    country: "Trung Quốc",
    quality: "HD",
    trailer: "https://www.youtube.com/watch?v=example1",
    type: "movie"
  },
  {
    id: "2",
    title: "Cô Ấy Thuộc Về Tôi",
    originalTitle: "She's Mine",
    poster: "https://media.voocdn.com/media/image/id/647a22a2acc39996228b45f2_720x",
    backdrop: "https://picsum.photos/id/42/1920/1080",
    overview: "Tác phẩm xoay quanh câu chuyện về cô gái trẻ Gia Bảo đính hôn với Phong – CEO của một tập đoàn kinh doanh lớn. Vì công việc, Phong phải đi công tác thường xuyên để chuẩn bị cho việc mở rộng công ty ra nước ngoài.",
    releaseDate: "2023-04-14",
    runtime: 102,
    rating: 6.8,
    genres: [
      { id: "romance", name: "Tình Cảm" },
      { id: "drama", name: "Chính Kịch" }
    ],
    language: "vi",
    country: "Việt Nam",
    quality: "HD",
    trailer: "https://www.youtube.com/watch?v=example2",
    type: "movie"
  },
  {
    id: "3",
    title: "Quỷ Ám 4: Khởi Nguồn",
    originalTitle: "The Conjuring: The Origin",
    poster: "https://media.voocdn.com/media/image/id/647a2341acc39996228b45f4_720x",
    backdrop: "https://media.voocdn.com/media/image/id/647a2341acc39996228b45f4_720x",
    overview: "Một nữ tu và một ông bố góa vợ đang chuẩn bị cho cuộc chiến cuối cùng giữa thiện và ác để bảo vệ linh hồn của con trai ông. Vào năm 1956, cha Vittorio De Angelis đối mặt với thực thể tàn ác nhất mà ông từng gặp: một cậu bé bị quỷ ám.",
    releaseDate: "2023-09-15",
    runtime: 115,
    rating: 7.5,
    genres: [
      { id: "horror", name: "Kinh Dị" },
      { id: "thriller", name: "Giật Gân" }
    ],
    language: "en",
    country: "Âu Mỹ",
    quality: "FHD",
    trailer: "https://www.youtube.com/watch?v=example3",
    type: "movie"
  },
  {
    id: "4",
    title: "Biệt Đội Marvel",
    originalTitle: "The Marvels",
    poster: "https://media.voocdn.com/media/image/id/647a23e1acc39996228b4601_720x",
    backdrop: "https://media.voocdn.com/media/image/id/647a23e1acc39996228b4601_720x",
    overview: "Carol Danvers, hay còn được biết đến với danh tính Captain Marvel, đã lấy lại được danh tính của mình từ tay bạo chúa Kree và trả thù Trí tuệ Tối cao. Nhưng những hậu quả không lường trước được khiến Carol phải gánh vác trách nhiệm trong một vũ trụ bấp bênh.",
    releaseDate: "2023-11-10",
    runtime: 130,
    rating: 6.5,
    genres: [
      { id: "action", name: "Hành Động" },
      { id: "scifi", name: "Viễn Tưởng" },
      { id: "adventure", name: "Phiêu Lưu" }
    ],
    language: "en",
    country: "Âu Mỹ",
    quality: "4K",
    trailer: "https://www.youtube.com/watch?v=example4",
    type: "movie"
  },
  {
    id: "5",
    title: "Đất Rừng Phương Nam",
    originalTitle: "",
    poster: "https://media.voocdn.com/media/image/id/647a2454acc39996228b4603_720x",
    backdrop: "https://media.voocdn.com/media/image/id/647a2454acc39996228b4603_720x",
    overview: "Phim Đất Rừng Phương Nam được chuyển thể từ tiểu thuyết cùng tên của nhà văn Đoàn Giỏi, kể về hành trình phiêu lưu của An - một cậu bé chẳng may mất mẹ trên đường chạy loạn. Trong hành trình tìm cha, An gặp và kết bạn với nhiều người từ nhiều tầng lớp khác nhau.",
    releaseDate: "2023-10-20",
    runtime: 110,
    rating: 8.2,
    genres: [
      { id: "adventure", name: "Phiêu Lưu" },
      { id: "drama", name: "Chính Kịch" },
      { id: "historical", name: "Cổ Trang" }
    ],
    language: "vi",
    country: "Việt Nam",
    quality: "HD",
    trailer: "https://www.youtube.com/watch?v=example5",
    type: "movie"
  },
];

// Mock TV Shows
export const mockTVShows: TVShow[] = [
  {
    id: "101",
    title: "Cuộc Đàm Phán Sinh Tử",
    originalTitle: "The Negotiation",
    poster: "https://media.voocdn.com/media/image/id/647a2454acc39996228b4603_720x",
    backdrop: "https://media.voocdn.com/media/image/id/647a2454acc39996228b4603_720x",
    overview: "Phim kể về quá trình Đội trưởng đội đàm phán khủng hoảng của đội cảnh sát hình sự thành phố Ha Nội đàm phán với những kẻ bắt cóc con tin.",
    releaseDate: "2023-06-05",
    runtime: 45,
    rating: 8.5,
    genres: [
      { id: "action", name: "Hành Động" },
      { id: "thriller", name: "Giật Gân" },
      { id: "drama", name: "Chính Kịch" }
    ],
    language: "vi",
    country: "Việt Nam",
    quality: "HD",
    trailer: "https://www.youtube.com/watch?v=example101",
    type: "tv",
    seasons: [
      {
        id: "101-s1",
        name: "Phần 1",
        seasonNumber: 1,
        episodeCount: 10,
        overview: "Phần đầu tiên của loạt phim Cuộc Đàm Phán Sinh Tử"
      }
    ]
  },
  {
    id: "102",
    title: "Anh Là Mùa Xuân Của Em",
    originalTitle: "You Are My Spring",
    poster: "https://media.voocdn.com/media/image/id/647a22a2acc39996228b45f2_720x",
    backdrop: "https://media.voocdn.com/media/image/id/647a22a2acc39996228b45f2_720x",
    overview: "Một nhóm người, mang theo những vết thương tình cảm từ thuở nhỏ giống nhau, gặp gỡ tại một tòa nhà nơi một vụ án mạng đã xảy ra.",
    releaseDate: "2023-01-20",
    runtime: 60,
    rating: 7.8,
    genres: [
      { id: "romance", name: "Tình Cảm" },
      { id: "drama", name: "Chính Kịch" }
    ],
    language: "ko",
    country: "Hàn Quốc",
    quality: "FHD",
    trailer: "https://www.youtube.com/watch?v=example102",
    type: "tv",
    seasons: [
      {
        id: "102-s1",
        name: "Phần 1",
        seasonNumber: 1,
        episodeCount: 16,
        overview: "Phần đầu tiên của loạt phim Anh Là Mùa Xuân Của Em"
      }
    ]
  },
  {
    id: "103",
    title: "Trường An Như Cố",
    originalTitle: "Chang An Memories",
    poster: "https://media.voocdn.com/media/image/id/647a2222acc39996228b45e4_720x",
    backdrop: "https://media.voocdn.com/media/image/id/647a2222acc39996228b45e4_720x",
    overview: "Phim kể về mối tình sóng gió của Thôi Thịnh và Nhậm An Dật trải qua nhiều năm tháng phong trần, từ tình bạn thuở nhỏ đến tình yêu sâu đậm.",
    releaseDate: "2023-03-15",
    runtime: 45,
    rating: 8.3,
    genres: [
      { id: "historical", name: "Cổ Trang" },
      { id: "romance", name: "Tình Cảm" },
      { id: "drama", name: "Chính Kịch" }
    ],
    language: "zh",
    country: "Trung Quốc",
    quality: "HD",
    trailer: "https://www.youtube.com/watch?v=example103",
    type: "tv",
    seasons: [
      {
        id: "103-s1",
        name: "Phần 1",
        seasonNumber: 1,
        episodeCount: 40,
        overview: "Phần đầu tiên của loạt phim Trường An Như Cố"
      }
    ]
  },
];

// Helper function to get featured movies (mix of movies and TV shows)
export function getFeaturedMedia(): Movie[] {
  const allMedia = [...mockMovies, ...mockTVShows];
  if (allMedia.length === 0) {
    console.error("No media data found in mockMovies or mockTVShows");
    // Trả về một mảng giả nếu không có dữ liệu
    return [
      {
        id: "placeholder-1",
        title: "Phim Mẫu 1",
        originalTitle: "Sample Movie 1",
        poster: "https://placehold.co/400x600/ccc/333?text=Phim+M%E1%BA%ABu+1",
        backdrop: "https://placehold.co/1920x1080/ccc/333?text=Phim+M%E1%BA%ABu+1",
        overview: "Đây là phim mẫu để hiển thị khi không có dữ liệu thật.",
        releaseDate: "2023-01-01",
        runtime: 120,
        rating: 7.5,
        genres: [
          { id: "drama", name: "Chính Kịch" }
        ],
        language: "vi",
        country: "Việt Nam",
        quality: "HD",
        type: "movie"
      },
      {
        id: "placeholder-2",
        title: "Phim Mẫu 2",
        originalTitle: "Sample Movie 2",
        poster: "https://placehold.co/400x600/ccc/333?text=Phim+M%E1%BA%ABu+2",
        backdrop: "https://placehold.co/1920x1080/ccc/333?text=Phim+M%E1%BA%ABu+2",
        overview: "Đây là phim mẫu thứ hai để hiển thị khi không có dữ liệu thật.",
        releaseDate: "2023-02-01",
        runtime: 110,
        rating: 8.0,
        genres: [
          { id: "action", name: "Hành Động" }
        ],
        language: "vi",
        country: "Việt Nam",
        quality: "HD",
        type: "movie"
      }
    ];
  }
  return allMedia.slice(0, 8);
}

// Helper function to get trending movies
export function getTrendingMovies(): Movie[] {
  if (mockMovies.length === 0) {
    console.error("No movie data found in mockMovies");
    // Trả về một mảng giả nếu không có dữ liệu
    return [
      {
        id: "trending-1",
        title: "Trending Mẫu 1",
        originalTitle: "Trending Sample 1",
        poster: "https://placehold.co/400x600/ccc/333?text=Trending+1",
        backdrop: "https://placehold.co/1920x1080/ccc/333?text=Trending+1",
        overview: "Đây là phim trending mẫu để hiển thị khi không có dữ liệu thật.",
        releaseDate: "2023-03-01",
        runtime: 125,
        rating: 7.8,
        genres: [
          { id: "action", name: "Hành Động" }
        ],
        language: "vi",
        country: "Việt Nam",
        quality: "HD",
        type: "movie"
      },
      {
        id: "trending-2",
        title: "Trending Mẫu 2",
        originalTitle: "Trending Sample 2",
        poster: "https://placehold.co/400x600/ccc/333?text=Trending+2",
        backdrop: "https://placehold.co/1920x1080/ccc/333?text=Trending+2",
        overview: "Đây là phim trending mẫu thứ hai để hiển thị khi không có dữ liệu thật.",
        releaseDate: "2023-04-01",
        runtime: 115,
        rating: 8.2,
        genres: [
          { id: "comedy", name: "Hài Hước" }
        ],
        language: "vi",
        country: "Việt Nam",
        quality: "HD",
        type: "movie"
      }
    ];
  }
  return mockMovies.slice().sort(() => 0.5 - Math.random()).slice(0, 6);
}

// Helper function to get popular TV shows
export function getPopularTVShows(): TVShow[] {
  if (mockTVShows.length === 0) {
    console.error("No TV shows data found in mockTVShows");
    // Trả về một mảng giả nếu không có dữ liệu
    return [
      {
        id: "tvshow-1",
        title: "TV Show Mẫu 1",
        originalTitle: "TV Show Sample 1",
        poster: "https://placehold.co/400x600/ccc/333?text=TV+Show+1",
        backdrop: "https://placehold.co/1920x1080/ccc/333?text=TV+Show+1",
        overview: "Đây là TV show mẫu để hiển thị khi không có dữ liệu thật.",
        releaseDate: "2023-01-10",
        runtime: 45,
        rating: 8.0,
        genres: [
          { id: "drama", name: "Chính Kịch" }
        ],
        language: "vi",
        country: "Việt Nam",
        quality: "HD",
        type: "tv",
        seasons: [
          {
            id: "tvshow-1-s1",
            name: "Phần 1",
            seasonNumber: 1,
            episodeCount: 10,
            overview: "Phần đầu tiên của loạt phim TV Show Mẫu 1"
          }
        ]
      },
      {
        id: "tvshow-2",
        title: "TV Show Mẫu 2",
        originalTitle: "TV Show Sample 2",
        poster: "https://placehold.co/400x600/ccc/333?text=TV+Show+2",
        backdrop: "https://placehold.co/1920x1080/ccc/333?text=TV+Show+2",
        overview: "Đây là TV show mẫu thứ hai để hiển thị khi không có dữ liệu thật.",
        releaseDate: "2023-02-10",
        runtime: 50,
        rating: 7.5,
        genres: [
          { id: "romance", name: "Tình Cảm" }
        ],
        language: "vi",
        country: "Việt Nam",
        quality: "HD",
        type: "tv",
        seasons: [
          {
            id: "tvshow-2-s1",
            name: "Phần 1",
            seasonNumber: 1,
            episodeCount: 12,
            overview: "Phần đầu tiên của loạt phim TV Show Mẫu 2"
          }
        ]
      }
    ];
  }
  return mockTVShows.slice().sort(() => 0.5 - Math.random()).slice(0, 6);
}

// Helper function to get movie by ID
export function getMovieById(id: string): Movie | undefined {
  return [...mockMovies, ...mockTVShows].find(movie => movie.id === id);
}

// Helper function to get movies by genre
export function getMoviesByGenre(genreId: string): Movie[] {
  return [...mockMovies, ...mockTVShows].filter(movie => 
    movie.genres.some(genre => genre.id === genreId)
  );
}

// Helper function to get movies by country
export function getMoviesByCountry(country: string): Movie[] {
  return [...mockMovies, ...mockTVShows].filter(movie => 
    movie.country.toLowerCase() === country.toLowerCase()
  );
}

// Helper function to search movies
export function searchMovies(query: string): Movie[] {
  const searchTerm = query.toLowerCase();
  return [...mockMovies, ...mockTVShows].filter(movie => 
    movie.title.toLowerCase().includes(searchTerm) || 
    (movie.originalTitle && movie.originalTitle.toLowerCase().includes(searchTerm))
  );
} 