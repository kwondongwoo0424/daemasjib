import { useState } from 'react';
import { useVisits } from '../model/useVisits';

interface CreateVisitFormProps {
  userId: string;
  onSuccess?: () => void;
}

export const CreateVisitForm = ({ userId, onSuccess }: CreateVisitFormProps) => {
  const [restaurantId, setRestaurantId] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [rating, setRating] = useState(5);
  const [memo, setMemo] = useState('');
  const [visitedAt, setVisitedAt] = useState(new Date().toISOString().split('T')[0]);

  const { createVisit } = useVisits(userId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createVisit({
        userId,
        restaurantId,
        restaurantName,
        rating,
        memo,
        visitedAt: new Date(visitedAt),
      });

      setRestaurantId('');
      setRestaurantName('');
      setRating(5);
      setMemo('');
      setVisitedAt(new Date().toISOString().split('T')[0]);

      onSuccess?.();
    } catch (err) {
      console.error('Failed to create visit:', err);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">방문 기록 추가</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">식당 이름</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">식당 ID (선택)</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">평점</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">방문 날짜</span>
            </label>
            <input
              type="date"
              className="input input-bordered"
              value={visitedAt}
              onChange={(e) => setVisitedAt(e.target.value)}
              required
            />
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">메모</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            추가하기
          </button>
        </form>
      </div>
    </div>
  );
};
