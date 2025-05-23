import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/pages/home/HomePage";
import MoviesPage from "@/pages/movies/MoviesPage";
import TVShowsPage from "@/pages/tvshows/TVShowsPage";
import DetailPage from "@/pages/detail/DetailPage";
import WatchPage from "@/pages/watch/WatchPage";
import SearchPage from "@/pages/search/SearchPage";
import GenrePage from "@/pages/genre/GenrePage";
import CountryPage from "@/pages/country/CountryPage";
import LoginPage from "@/pages/login/index";
import RegisterPage from "@/pages/register/index";
import UserProfilePage from "@/pages/user_profile/index";
import NotFoundPage from "@/pages/error/NotFoundPage";

// We don't need BrowserRouter here since it's provided in App.tsx
export function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/home-page" replace />} />
          <Route path="home-page" element={<HomePage />} />
          <Route path="phim-le" element={<MoviesPage />} />
          <Route path="phim-bo" element={<TVShowsPage />} />
          <Route path="the-loai/:genreId" element={<GenrePage />} />
          <Route path="quoc-gia/:countryId" element={<CountryPage />} />
          <Route path="tim-kiem" element={<SearchPage />} />
        <Route path="phim/:slug" element={<DetailPage />} />
        <Route path="xem-phim/:slug" element={<WatchPage />} />
        <Route path="xem-phim/:slug/:episodeSlug" element={<WatchPage />} />
        <Route path="dang-nhap" element={<LoginPage />} />
        <Route path="dang-ky" element={<RegisterPage />} />
        <Route path="user-profile" element={<UserProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
  );
} 