import { useState } from 'react';
import { useRestaurants } from '../model/useRestaurants';
import type { Restaurant } from '../../../types';

interface RestaurantSearchProps {
  onSelect?: (restaurant: Restaurant) => void;
}

export const RestaurantSearch = ({ onSelect }: RestaurantSearchProps) => {
  const [searchType, setSearchType] = useState<'region' | 'category'>('region');
  const [searchQuery, setSearchQuery] = useState('');
  const { restaurants, loading, error, searchByRegion, searchByCategory } = useRestaurants();

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
              placeholder={searchType === 'region' ? '예: 강남구' : '예: 한식'}
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
              onClick={() => onSelect?.(restaurant)}
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
                  <p className="text-sm text-base-content/60 mt-2">{restaurant.phone}</p>
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
    </div>
  );
};
