import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../../pages/auth/AuthPage";
import { HomePage } from "../../pages/home/HomePage";
import { VisitsPage } from "../../pages/visits/VisitsPage";
import { BookmarksPage } from "../../pages/bookmarks/BookmarksPage";
import { RestaurantsPage } from "../../pages/restaurants/RestaurantsPage";
import { RestaurantDetailPage } from "../../pages/restaurants/RestaurantDetailPage";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/visits" element={<VisitsPage />} />
      <Route path="/bookmarks" element={<BookmarksPage />} />
      <Route path="/restaurants" element={<RestaurantsPage />} />
      <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;
