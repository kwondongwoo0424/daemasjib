import { useVisits } from '../model/useVisits';
import type { Visit } from '../../../types';

interface VisitListProps {
  userId: string;
  onEdit?: (visit: Visit) => void;
}

export const VisitList = ({ userId, onEdit }: VisitListProps) => {
  const { visits, loading, error, deleteVisit } = useVisits(userId);

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

  if (visits.length === 0) {
    return (
      <div className="text-center p-8 text-base-content/60">
        아직 방문 기록이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {visits.map((visit) => (
        <div key={visit.id} className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">{visit.restaurantName}</h3>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= (visit.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            {visit.memo && (
              <p className="text-sm text-base-content/70">{visit.memo}</p>
            )}
            <div className="text-xs text-base-content/50 mt-2">
              {new Date(visit.visitedAt).toLocaleDateString('ko-KR')}
            </div>
            <div className="card-actions justify-end mt-4">
              {onEdit && (
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => onEdit(visit)}
                >
                  수정
                </button>
              )}
              <button
                className="btn btn-sm btn-error btn-outline"
                onClick={() => {
                  if (confirm('정말 삭제하시겠습니까?')) {
                    deleteVisit(visit.id!);
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
  );
};
