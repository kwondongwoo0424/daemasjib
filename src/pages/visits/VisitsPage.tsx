import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth';
import { Header } from '@/shared/ui';
import { Star, Trash2, Utensils, MapPin, Calendar, Edit2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Restaurant } from '@/shared/types';

interface Visit {
  id: string;
  userId: string;
  restaurantId: string;
  visitedAt: Date;
  rating?: number;
  memo?: string;
  createdAt: Date;
}

export const VisitsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [visits, setVisits] = useState<{ visit: Visit; restaurant: Restaurant }[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editMemo, setEditMemo] = useState('');

  useEffect(() => {
    if (!user) return;

    const loadVisits = async () => {
      try {
        setLoading(true);
        const { visitService } = await import('@/entities/visit/api/visitService');
        const { restaurantService } = await import('@/entities/restaurant/api/restaurantService');

        const userVisits = await visitService.getVisitsByUserId(user.uid);

        const visitsWithRestaurants = await Promise.all(
          userVisits.map(async (visit: any) => {
            const restaurant = await restaurantService.getRestaurantById(visit.restaurantId);
            return restaurant ? { visit, restaurant } : null;
          })
        );

        const filteredVisits = visitsWithRestaurants.filter((v: any) => v !== null) as { visit: Visit; restaurant: Restaurant }[];
        setVisits(filteredVisits);
      } catch (error) {
        console.error('Failed to load visits:', error);
        toast.error(t('toast.visitLoadFailed'));
      } finally {
        setLoading(false);
      }
    };

    loadVisits();
  }, [user]);

  const handleEditVisit = (visit: Visit) => {
    setEditingVisit(visit);
    setEditRating(visit.rating || 5);
    setEditMemo(visit.memo || '');
  };

  const handleUpdateVisit = async () => {
    if (!user || !editingVisit) return;

    try {
      const { visitService } = await import('@/entities/visit/api/visitService');
      await visitService.updateVisit(editingVisit.id, {
        rating: editRating,
        memo: editMemo
      });

      // 로컬 상태 업데이트
      setVisits(prev => prev.map(v =>
        v.visit.id === editingVisit.id
          ? { ...v, visit: { ...v.visit, rating: editRating, memo: editMemo } }
          : v
      ));

      toast.success(t('toast.visitUpdated'));
      setEditingVisit(null);
      setEditRating(5);
      setEditMemo('');
    } catch (error) {
      console.error('Failed to update visit:', error);
      toast.error(t('toast.visitUpdateFailed'));
    }
  };

  const handleRemoveVisit = async (visitId: string) => {
    if (!user) return;

    try {
      const { visitService } = await import('@/entities/visit/api/visitService');
      await visitService.deleteVisit(visitId);
      setVisits(prev => prev.filter(v => v.visit.id !== visitId));
      toast.success(t('toast.visitRemoved'));
    } catch (error) {
      console.error('Failed to remove visit:', error);
      toast.error(t('toast.visitRemoveFailed'));
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <Star className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {t('auth.loginRequired')}
          </h2>
          <p className="text-gray-600 mb-6">{t('visits.loginMessage')}</p>
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
        ) : visits.length === 0 ? (
          <div className="text-center py-20">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-6">{t('visits.noVisits')}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
            >
              {t('home.goButton')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {visits.map(({ visit, restaurant }) => (
              <div
                key={visit.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  className="cursor-pointer"
                >
                  <div className="h-32 sm:h-40 bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <Utensils className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-50 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-800 line-clamp-1">
                      {restaurant.name}
                    </h3>
                    <div className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                      {restaurant.category && (
                        <div className="flex items-center gap-1">
                          <Utensils className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                          <span className="line-clamp-1">{restaurant.category}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                        <span className="line-clamp-1">{restaurant.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                        <span className="text-xs">
                          {formatDate(visit.visitedAt instanceof Date ? visit.visitedAt : new Date(visit.visitedAt))}
                        </span>
                      </div>
                      {visit.rating && (
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${i < visit.rating! ? 'text-yellow-500' : 'text-gray-300'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {visit.memo && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700 line-clamp-2">
                          {visit.memo}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-3 pb-3 sm:px-4 sm:pb-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditVisit(visit);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    {t('common.edit')}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveVisit(visit.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 방문 기록 수정 모달 */}
      {editingVisit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">{t('visitModal.editTitle')}</h3>
              <button
                onClick={() => {
                  setEditingVisit(null);
                  setEditRating(5);
                  setEditMemo('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">{t('visitModal.restaurant')}</p>
              <p className="text-gray-800 font-medium">
                {visits.find(v => v.visit.id === editingVisit.id)?.restaurant.name}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-500 mb-2">{t('visitModal.rating')}</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-4xl transition-all ${
                      star <= editRating ? 'text-yellow-500 scale-110' : 'text-gray-300'
                    } hover:scale-125`}
                    onClick={() => setEditRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-500 mb-2">{t('visitModal.memo')}</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900"
                rows={4}
                placeholder={t('visitModal.memoPlaceholder')}
                value={editMemo}
                onChange={(e) => setEditMemo(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingVisit(null);
                  setEditRating(5);
                  setEditMemo('');
                }}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleUpdateVisit}
                className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
              >
                {t('visitModal.update')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
