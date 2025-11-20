import { useState } from 'react';
import { useRestaurants } from '../model/useRestaurants';
import { useAuth } from '../../auth';
import { visitService } from '../../../services/visitService';
import type { Restaurant } from '../../../types';

interface RestaurantSearchProps {
  onSelect?: (restaurant: Restaurant) => void;
}

export const RestaurantSearch = ({ onSelect }: RestaurantSearchProps) => {
  const [searchType, setSearchType] = useState<'region' | 'category'>('region');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitData, setVisitData] = useState({ rating: 5, memo: '' });
  const [saving, setSaving] = useState(false);
  const { restaurants, loading, error, searchByRegion, searchByCategory } = useRestaurants();
  const { user } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      if (searchType === 'region') {
        await searchByRegion(searchQuery);
      } else {
        await searchByCategory(searchQuery);
      }
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowVisitModal(true);
    onSelect?.(restaurant);
  };

  const handleSaveVisit = async () => {
    if (!user || !selectedRestaurant) return;

    setSaving(true);
    try {
      await visitService.createVisit({
        userId: user.uid,
        restaurantId: selectedRestaurant.id,
        restaurantName: selectedRestaurant.name,
        visitedAt: new Date(),
        rating: visitData.rating,
        memo: visitData.memo,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      alert('방문 기록이 저장되었습니다!');
      setShowVisitModal(false);
      setVisitData({ rating: 5, memo: '' });
    } catch (err) {
      console.error('방문 기록 저장 실패:', err);
      alert('방문 기록 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">식당 검색</h2>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">검색 유형</span>
            </label>
            <div className="join">
              <button
                type="button"
                className={`btn join-item ${searchType === 'region' ? 'btn-active' : ''}`}
                onClick={() => setSearchType('region')}
              >
                지역
              </button>
              <button
                type="button"
                className={`btn join-item ${searchType === 'category' ? 'btn-active' : ''}`}
                onClick={() => setSearchType('category')}
              >
                카테고리
              </button>
            </div>
          </div>

          <div className="join w-full">
            <input
              type="text"
              className="input input-bordered join-item flex-1"
              placeholder={searchType === 'region' ? '예: 중구, 동구' : '예: 한식, 일식'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary join-item" disabled={loading}>
              {loading ? '검색 중...' : '검색'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {restaurants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
              onClick={() => handleRestaurantClick(restaurant)}
            >
              <div className="card-body">
                <h3 className="card-title">{restaurant.name}</h3>
                <p className="text-sm text-base-content/60">{restaurant.address}</p>
                <div className="flex gap-2 mt-2">
                  {restaurant.category && (
                    <span className="badge badge-primary">{restaurant.category}</span>
                  )}
                  {restaurant.region && (
                    <span className="badge badge-secondary">{restaurant.region}</span>
                  )}
                </div>
                {restaurant.phone && (
                  <p className="text-sm text-base-content/60 mt-2">📞 {restaurant.phone}</p>
                )}
                {restaurant.businessHours && (
                  <p className="text-sm text-base-content/60">🕐 {restaurant.businessHours}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && restaurants.length === 0 && searchQuery && (
        <div className="text-center p-8 text-base-content/60">
          검색 결과가 없습니다.
        </div>
      )}

      {/* 방문 기록 저장 모달 */}
      {showVisitModal && selectedRestaurant && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">방문 기록 저장</h3>
            
            <div className="mb-4">
              <p className="font-semibold">{selectedRestaurant.name}</p>
              <p className="text-sm text-base-content/60">{selectedRestaurant.address}</p>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">평점</span>
              </label>
              <div className="rating rating-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input
                    key={star}
                    type="radio"
                    name="rating"
                    className="mask mask-star-2 bg-orange-400"
                    checked={visitData.rating === star}
                    onChange={() => setVisitData({ ...visitData, rating: star })}
                  />
                ))}
              </div>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">메모 (선택)</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="방문 소감을 입력하세요..."
                value={visitData.memo}
                onChange={(e) => setVisitData({ ...visitData, memo: e.target.value })}
              />
            </div>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  setShowVisitModal(false);
                  setVisitData({ rating: 5, memo: '' });
                }}
                disabled={saving}
              >
                취소
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveVisit}
                disabled={saving}
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowVisitModal(false)} />
        </div>
      )}
    </div>
  );
};
