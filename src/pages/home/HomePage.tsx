import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from '@/shared/ui';
import { Search, MapPin, Utensils, Clock, Star, Bookmark, Coffee, UtensilsCrossed, Pizza, Soup, Wine, Cake, Globe2, ChevronLeft, ChevronRight, X, Phone, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Restaurant } from '@/shared/types';

const REGIONS = ['북구', '동구', '서구', '중구', '남구', '달성군', '달서구', '수성구'];
const CATEGORIES = [
  '디저트/베이커리',
  '일식',
  '한식',
  '중식',
  '전통차/커피전문점',
  '특별한 술집',
  '양식',
  '세계요리'
];

// 카테고리별 색상 및 아이콘 매핑
const CATEGORY_THEMES: Record<string, { gradient: string; icon: any; bgLight: string; textColor: string }> = {
  '디저트/베이커리': {
    gradient: 'from-pink-400 to-pink-600',
    icon: Cake,
    bgLight: 'bg-pink-50',
    textColor: 'text-pink-700'
  },
  '일식': {
    gradient: 'from-red-400 to-red-600',
    icon: UtensilsCrossed,
    bgLight: 'bg-red-50',
    textColor: 'text-red-700'
  },
  '한식': {
    gradient: 'from-orange-400 to-orange-600',
    icon: Soup,
    bgLight: 'bg-orange-50',
    textColor: 'text-orange-700'
  },
  '중식': {
    gradient: 'from-yellow-500 to-yellow-700',
    icon: UtensilsCrossed,
    bgLight: 'bg-yellow-50',
    textColor: 'text-yellow-800'
  },
  '전통차/커피전문점': {
    gradient: 'from-amber-500 to-amber-700',
    icon: Coffee,
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-800'
  },
  '특별한 술집': {
    gradient: 'from-purple-400 to-purple-600',
    icon: Wine,
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-700'
  },
  '양식': {
    gradient: 'from-blue-400 to-blue-600',
    icon: Pizza,
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  '세계요리': {
    gradient: 'from-green-400 to-green-600',
    icon: Globe2,
    bgLight: 'bg-green-50',
    textColor: 'text-green-700'
  }
};

const ITEMS_PER_PAGE = 28;

export const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitRating, setVisitRating] = useState(5);
  const [visitMemo, setVisitMemo] = useState('');

  useEffect(() => {
    // 초기 로딩 시 모든 식당 가져오기
    loadAllRestaurants();
  }, []);

  const loadAllRestaurants = async () => {
    try {
      setLoading(true);
      const { restaurantService } = await import('@/entities/restaurant/api/restaurantService');
      const all = await restaurantService.getAllRestaurants();
      setAllRestaurants(all);
    } catch (err) {
      console.error('Failed to load restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev =>
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredRestaurants = allRestaurants.filter(restaurant => {
    const matchesSearch = !searchQuery ||
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegions.length === 0 ||
      selectedRegions.includes(restaurant.region);
    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.some(cat => restaurant.category?.includes(cat));

    return matchesSearch && matchesRegion && matchesCategory;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  // 필터 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRegions, selectedCategories]);

  // 카테고리에 맞는 테마 가져오기
  const getCategoryTheme = (category?: string) => {
    if (!category) return CATEGORY_THEMES['한식'];
    const matchedKey = Object.keys(CATEGORY_THEMES).find(key => category.includes(key));
    return matchedKey ? CATEGORY_THEMES[matchedKey] : CATEGORY_THEMES['한식'];
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedRestaurant(null), 300); // 애니메이션 후 상태 초기화
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white">
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 검색 섹션 */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            {/* 검색창 */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('home.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* 지역 필터 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-700">{t('home.region')}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map(region => (
                  <button
                    key={region}
                    onClick={() => toggleRegion(region)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedRegions.includes(region)
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* 카테고리 필터 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-700">{t('home.category')}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategories.includes(category)
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 결과 수 */}
          <div className="text-gray-600 mb-4">
            {t('home.totalRestaurants', { count: filteredRestaurants.length })}
          </div>
        </div>

        {/* 식당 리스트 */}
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
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {paginatedRestaurants.map(restaurant => {
                const theme = getCategoryTheme(restaurant.category);
                const IconComponent = theme.icon;

                return (
                  <div
                    key={restaurant.id}
                    onClick={() => handleRestaurantClick(restaurant)}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                  >
                    <div className={`h-32 sm:h-40 bg-linear-to-br ${theme.gradient} flex items-center justify-center`}>
                      <IconComponent className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-50 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-800 line-clamp-1">
                        {restaurant.name}
                      </h3>
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                        {restaurant.category && (
                          <div className="flex items-center gap-1">
                            <Utensils className={`w-3 h-3 sm:w-4 sm:h-4 ${theme.textColor}`} />
                            <span className="line-clamp-1">{restaurant.category}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="line-clamp-1">{restaurant.address}</span>
                        </div>
                        {restaurant.businessHours && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                            <span className="line-clamp-1">{restaurant.businessHours}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 sm:mt-3 flex gap-2">
                        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 ${theme.bgLight} ${theme.textColor} text-xs font-medium rounded-full`}>
                          {restaurant.region}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>

                <div className="flex items-center gap-1 sm:gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      const range = 2;
                      return page === 1 || page === totalPages || Math.abs(currentPage - page) <= range;
                    })
                    .map((page, index, arr) => (
                      <div key={page} className="flex items-center gap-1 sm:gap-2">
                        {index > 0 && arr[index - 1] !== page - 1 && (
                          <span className="text-gray-400 text-sm">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-orange-500 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            )}
          </>
        )}

        {filteredRestaurants.length === 0 && !loading && (
          <div className="text-center py-12 sm:py-20">
            <Utensils className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-base sm:text-lg">{t('home.noResults')}</p>
          </div>
        )}
      </main>

      {/* 슬라이딩 패널 - 상세 정보 */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[500px] lg:w-[600px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isDetailOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedRestaurant && (
          <div className="p-6">
            {/* 닫기 버튼 */}
            <button
              onClick={handleCloseDetail}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={t('home.close')}
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            {/* 레스토랑 이름 */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 pr-12">
              {selectedRestaurant.name}
            </h2>

            <div className="space-y-5">
              {/* 카테고리 */}
              {selectedRestaurant.category && (
                <div className="flex items-start gap-3">
                  <Utensils className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{t('home.categoryLabel')}</p>
                    <p className="text-gray-800">{selectedRestaurant.category}</p>
                  </div>
                </div>
              )}

              {/* 주소 */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">{t('home.address')}</p>
                  <p className="text-gray-800">{selectedRestaurant.address}</p>
                </div>
              </div>

              {/* 전화번호 */}
              {selectedRestaurant.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{t('home.phone')}</p>
                    <a
                      href={`tel:${selectedRestaurant.phone}`}
                      className="text-gray-800 hover:text-orange-500 transition-colors"
                    >
                      {selectedRestaurant.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* 영업시간 */}
              {selectedRestaurant.businessHours && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{t('home.businessHours')}</p>
                    <p className="text-gray-800">{selectedRestaurant.businessHours}</p>
                  </div>
                </div>
              )}

              {/* 메뉴 */}
              {selectedRestaurant.menu && (
                <div className="flex items-start gap-3">
                  <Utensils className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{t('home.menu')}</p>
                    <div
                      className="text-gray-800"
                      dangerouslySetInnerHTML={{ __html: selectedRestaurant.menu }}
                    />
                  </div>
                </div>
              )}

              {/* 설명 */}
              {selectedRestaurant.description && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{t('home.description')}</p>
                    <div
                      className="text-gray-800"
                      dangerouslySetInnerHTML={{ __html: selectedRestaurant.description }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 액션 버튼 */}
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  if (!user) {
                    toast.warning(t('toast.loginRequired'));
                    navigate('/auth');
                    return;
                  }
                  setIsVisitModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
              >
                <Star className="w-4 h-4" />
                {t('home.addVisit')}
              </button>
              <button
                onClick={async () => {
                  if (!user) {
                    toast.warning(t('toast.loginRequired'));
                    navigate('/auth');
                    return;
                  }
                  try {
                    const { bookmarkService } = await import('@/entities/bookmark/api/bookmarkService');
                    const bookmarks = await bookmarkService.getBookmarksByUserId(user.uid);
                    const isBookmarked = bookmarks.some((b: any) => b.restaurantId === selectedRestaurant.id);

                    if (isBookmarked) {
                      const bookmark = bookmarks.find((b: any) => b.restaurantId === selectedRestaurant.id);
                      if (bookmark?.id) {
                        await bookmarkService.deleteBookmark(bookmark.id);
                        toast.success(t('toast.bookmarkRemoved'));
                      }
                    } else {
                      // 기본 그룹 찾기 또는 생성
                      let groups = await bookmarkService.getBookmarkGroups(user.uid);
                      let defaultGroup = groups.find(g => g.groupName === t('bookmarks.title'));

                      if (!defaultGroup) {
                        const groupId = await bookmarkService.createGroup(user.uid, t('bookmarks.title'));
                        groups = await bookmarkService.getBookmarkGroups(user.uid);
                        defaultGroup = groups.find(g => g.id === groupId);
                      }

                      if (defaultGroup?.id) {
                        await bookmarkService.addBookmark({
                          userId: user.uid,
                          groupId: defaultGroup.id,
                          restaurantId: selectedRestaurant.id,
                          restaurantName: selectedRestaurant.name,
                          restaurantAddress: selectedRestaurant.address,
                          createdAt: new Date()
                        });
                        toast.success(t('toast.bookmarkAdded'));
                      }
                    }
                  } catch (error) {
                    console.error('Failed to toggle bookmark:', error);
                    toast.error(t('toast.bookmarkFailed'));
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                <Bookmark className="w-4 h-4" />
                {t('home.addBookmark')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 방문 기록 추가 모달 */}
      {isVisitModalOpen && selectedRestaurant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">{t('visitModal.addTitle')}</h3>
              <button
                onClick={() => {
                  setIsVisitModalOpen(false);
                  setVisitRating(5);
                  setVisitMemo('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">{t('visitModal.restaurant')}</p>
              <p className="text-gray-800 font-medium">{selectedRestaurant.name}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-500 mb-2">{t('visitModal.rating')}</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-4xl transition-all ${
                      star <= visitRating ? 'text-yellow-500 scale-110' : 'text-gray-300'
                    } hover:scale-125`}
                    onClick={() => setVisitRating(star)}
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
                value={visitMemo}
                onChange={(e) => setVisitMemo(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsVisitModalOpen(false);
                  setVisitRating(5);
                  setVisitMemo('');
                }}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={async () => {
                  if (!user || !selectedRestaurant) return;

                  try {
                    const { visitService } = await import('@/entities/visit/api/visitService');
                    await visitService.createVisit({
                      userId: user.uid,
                      restaurantId: selectedRestaurant.id,
                      restaurantName: selectedRestaurant.name,
                      visitedAt: new Date(),
                      rating: visitRating,
                      memo: visitMemo
                    });
                    toast.success(t('toast.visitAdded'));
                    setIsVisitModalOpen(false);
                    setVisitRating(5);
                    setVisitMemo('');
                  } catch (error) {
                    console.error('Failed to add visit:', error);
                    toast.error(t('toast.visitAddFailed'));
                  }
                }}
                className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
              >
                {t('visitModal.add')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
