import { useState } from 'react';
import { useBookmarks } from '@/entities/bookmark';

interface BookmarkListProps {
  userId: string;
  groupId: string;
}

export const BookmarkList = ({ userId, groupId }: BookmarkListProps) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { bookmarks, loading, error, addBookmark, deleteBookmark } = useBookmarks(groupId);

  const handleAddBookmark = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addBookmark({
        userId,
        groupId,
        restaurantId,
        restaurantName,
        restaurantAddress,
      });

      setRestaurantName('');
      setRestaurantId('');
      setRestaurantAddress('');
      setIsAdding(false);
    } catch (err) {
      console.error('Failed to add bookmark:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">북마크 목록</h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? '취소' : '+ 추가'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddBookmark} className="card bg-base-100 shadow-xl mb-4">
          <div className="card-body">
            <div className="form-control mb-3">
              <input
                type="text"
                className="input input-bordered"
                placeholder="식당 이름"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                required
              />
            </div>
            <div className="form-control mb-3">
              <input
                type="text"
                className="input input-bordered"
                placeholder="식당 ID (선택)"
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
              />
            </div>
            <div className="form-control mb-3">
              <input
                type="text"
                className="input input-bordered"
                placeholder="주소 (선택)"
                value={restaurantAddress}
                onChange={(e) => setRestaurantAddress(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              추가하기
            </button>
          </div>
        </form>
      )}

      {bookmarks.length === 0 ? (
        <div className="text-center p-8 text-base-content/60">
          아직 북마크가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h4 className="card-title">{bookmark.restaurantName}</h4>
                {bookmark.restaurantAddress && (
                  <p className="text-sm text-base-content/60">{bookmark.restaurantAddress}</p>
                )}
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-sm btn-error btn-outline"
                    onClick={() => {
                      if (confirm('이 북마크를 삭제하시겠습니까?')) {
                        deleteBookmark(bookmark.id!);
                      }
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
