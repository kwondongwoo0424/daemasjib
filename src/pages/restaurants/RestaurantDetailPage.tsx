import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth';
import { ArrowLeft, MapPin, Phone, Clock, Utensils, FileText, Star, Bookmark } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Restaurant, Bookmark as BookmarkType } from '@/shared/types';

export const RestaurantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRestaurant = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { restaurantService } = await import('@/entities/restaurant/api/restaurantService');
        const data = await restaurantService.getRestaurantById(id);
        setRestaurant(data);
      } catch (error) {
        console.error('Failed to load restaurant:', error);
        toast.error(t('toast.restaurantLoadFailed'));
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();
  }, [id, navigate]);

  // 카카오 맵 초기화
  useEffect(() => {
    if (!restaurant || !window.kakao) return;

    const initMap = () => {
      const container = document.getElementById('kakao-map');
      if (!container) return;

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(restaurant.address, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

          const options = {
            center: coords,
            level: 3
          };

          const map = new window.kakao.maps.Map(container, options);

          const marker = new window.kakao.maps.Marker({
            map: map,
            position: coords
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:12px;width:150px;text-align:center;">${restaurant.name}</div>`
          });

          infowindow.open(map, marker);
        } else {
          console.error('Geocoding failed:', status);
        }
      });
    };

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initMap);
    } else {
      initMap();
    }
  }, [restaurant]);

  const handleAddVisit = async () => {
    if (!user || !restaurant) {
      toast.warning(t('toast.loginRequired'));
      navigate('/auth');
      return;
    }

    try {
      const { visitService } = await import('@/entities/visit/api/visitService');
      await visitService.createVisit({
        userId: user.uid,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        visitedAt: new Date(),
        rating: 5,
        memo: ''
      });
      toast.success(t('toast.visitAdded'));
    } catch (error) {
      console.error('Failed to add visit:', error);
      toast.error(t('toast.visitAddFailed'));
    }
  };

  const handleToggleBookmark = async () => {
    if (!user || !restaurant) {
      toast.warning(t('toast.loginRequired'));
      navigate('/auth');
      return;
    }

    try {
      const { bookmarkService } = await import('@/entities/bookmark/api/bookmarkService');
      const bookmarks = await bookmarkService.getBookmarksByUserId(user.uid);
      const isBookmarked = bookmarks.some((b: BookmarkType) => b.restaurantId === restaurant.id);

      if (isBookmarked) {
        const bookmark = bookmarks.find((b: BookmarkType) => b.restaurantId === restaurant.id);
        if (bookmark && bookmark.id) {
          await bookmarkService.deleteBookmark(bookmark.id);
          toast.success(t('toast.bookmarkRemoved'));
        }
      } else {
        // Get or create default group
        let groups = await bookmarkService.getGroupsByUserId(user.uid);
        if (groups.length === 0) {
          await bookmarkService.createGroup(user.uid, t('bookmarks.title'));
          groups = await bookmarkService.getGroupsByUserId(user.uid);
        }
        const defaultGroup = groups[0];

        if (defaultGroup && defaultGroup.id) {
          await bookmarkService.addBookmark({
            userId: user.uid,
            groupId: defaultGroup.id,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            restaurantAddress: restaurant.address,
            createdAt: new Date()
          });
          toast.success(t('toast.bookmarkAdded'));
        }
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      toast.error(t('toast.bookmarkFailed'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{t('restaurantDetail.back')}</span>
        </button>

        {/* 식당 정보 카드 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{restaurant.name}</h1>

            <div className="space-y-5">
              {/* Category */}
              {restaurant.category && (
                <div className="flex items-start gap-3">
                  <Utensils className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{t('restaurantDetail.category')}</p>
                    <p className="text-gray-800">{restaurant.category}</p>
                  </div>
                </div>
              )}

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">{t('restaurantDetail.address')}</p>
                  <p className="text-gray-800">{restaurant.address}</p>
                </div>
              </div>

              {/* 카카오 지도 */}
              <div className="w-full h-64 sm:h-80 bg-gray-100 rounded-lg overflow-hidden">
                <div id="kakao-map" className="w-full h-full"></div>
              </div>

              {/* Phone */}
              {restaurant.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{t('restaurantDetail.phone')}</p>
                    <a
                      href={`tel:${restaurant.phone}`}
                      className="text-gray-800 hover:text-orange-500 transition-colors"
                    >
                      {restaurant.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Business Hours */}
              {restaurant.businessHours && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{t('restaurantDetail.businessHours')}</p>
                    <p className="text-gray-800">{restaurant.businessHours}</p>
                  </div>
                </div>
              )}

              {/* Menu */}
              {restaurant.menu && (
                <div className="flex items-start gap-3">
                  <Utensils className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{t('restaurantDetail.menu')}</p>
                    <div
                      className="text-gray-800"
                      dangerouslySetInnerHTML={{ __html: restaurant.menu }}
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              {restaurant.description && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{t('restaurantDetail.description')}</p>
                    <div
                      className="text-gray-800"
                      dangerouslySetInnerHTML={{ __html: restaurant.description }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleAddVisit}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
              >
                <Star className="w-4 h-4" />
                {t('restaurantDetail.addVisit')}
              </button>
              <button
                onClick={handleToggleBookmark}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                <Bookmark className="w-4 h-4" />
                {t('restaurantDetail.bookmark')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
