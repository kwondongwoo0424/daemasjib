import { useState } from 'react';
import { useBookmarkGroups } from '@/entities/bookmark';

interface BookmarkGroupListProps {
  userId: string;
  onSelectGroup?: (groupId: string) => void;
}

export const BookmarkGroupList = ({ userId, onSelectGroup }: BookmarkGroupListProps) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { groups, loading, error, createGroup, deleteGroup } = useBookmarkGroups(userId);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      await createGroup(newGroupName);
      setNewGroupName('');
      setIsCreating(false);
    } catch (err) {
      console.error('Failed to create group:', err);
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
        <h2 className="text-2xl font-bold">북마크 그룹</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? '취소' : '+ 새 그룹'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateGroup} className="mb-4">
          <div className="join w-full">
            <input
              type="text"
              className="input input-bordered join-item flex-1"
              placeholder="그룹 이름"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <button type="submit" className="btn btn-primary join-item">
              생성
            </button>
          </div>
        </form>
      )}

      {groups.length === 0 ? (
        <div className="text-center p-8 text-base-content/60">
          아직 북마크 그룹이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
              onClick={() => onSelectGroup?.(group.id!)}
            >
              <div className="card-body">
                <h3 className="card-title">{group.groupName}</h3>
                <p className="text-sm text-base-content/60">
                  북마크 {group.bookmarkCount || 0}개
                </p>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-sm btn-error btn-outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('이 그룹을 삭제하시겠습니까?')) {
                        deleteGroup(group.id!);
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
