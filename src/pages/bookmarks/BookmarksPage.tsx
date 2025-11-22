import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth';
import { Header } from '@/shared/ui';
import { Bookmark, Trash2, Utensils, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Restaurant } from '@/shared/types';

export const BookmarksPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [bookmarks, setBookmarks] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadBookmarks = async () => {
      try {
        setLoading(true);
        const { bookmarkService } = await import('@/entities/bookmark/api/bookmarkService');
        const { restaurantService } = await import('@/entities/restaurant/api/restaurantService');

        const userBookmarks = await bookmarkService.getBookmarksByUserId(user.uid);
        const restaurants = await Promise.all(
          userBookmarks.map((b: any) => restaurantService.getRestaurantById(b.restaurantId))
        );

        setBookmarks(restaurants.filter((r: any) => r !== null) as Restaurant[]);
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
        toast.error('북마크를 불러올 수 없습니다');
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [user]);

  const handleRemoveBookmark = async (restaurantId: string) => {
    if (!user) return;

    try {
      const { bookmarkService } = await import('@/entities/bookmark/api/bookmarkService');
      const userBookmarks = await bookmarkService.getBookmarksByUserId(user.uid);
      const bookmark = userBookmarks.find((b: any) => b.restaurantId === restaurantId);

      if (bookmark?.id) {
        await bookmarkService.deleteBookmark(bookmark.id);
        setBookmarks(prev => prev.filter(r => r.id !== restaurantId));
        toast.success('북마크가 제거되었습니다');
      }
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      toast.error('북마크 제거에 실패했습니다');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <Bookmark className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {t('auth.loginRequired')}
          </h2>
          <p className="text-gray-600 mb-6">{t('bookmarks.loginMessage')}</p>
          <button
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors mb-3"
            onClick={() => navigate('/auth')}
          >
            {t('auth.login')}
          </button>
          <button
            className="w-full py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
            onClick={() => navigate('/')}
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white">
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-32 sm:h-40 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-6">{t('bookmarks.noBookmarks')}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
            >
              맛집 탐색하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {bookmarks.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  className="cursor-pointer"
                >
                  <div className="h-32 sm:h-40 bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Utensils className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-50 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-800 line-clamp-1">
                      {restaurant.name}
                    </h3>
                    <div className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                      {restaurant.category && (
                        <div className="flex items-center gap-1">
                          <Utensils className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                          <span className="line-clamp-1">{restaurant.category}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                        <span className="line-clamp-1">{restaurant.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                  <button
                    onClick={() => handleRemoveBookmark(restaurant.id)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    북마크 제거
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
