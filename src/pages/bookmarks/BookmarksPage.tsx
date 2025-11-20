import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/auth';
import { BookmarkGroupList, BookmarkList } from '../../features/bookmark';
import { LanguageSwitcher } from '../../shared/ui';

export const BookmarksPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <button
            className="btn btn-ghost text-sm md:text-base"
            onClick={() => navigate('/')}
          >
            ← {t('common.back')}
          </button>
          <a className="btn btn-ghost text-lg md:text-xl">{t('bookmarks.title')}</a>
        </div>
        <div className="flex-none gap-2">
          <LanguageSwitcher />
          {selectedGroupId && (
            <button
              className="btn btn-ghost btn-sm md:btn-md text-xs md:text-sm"
              onClick={() => setSelectedGroupId(null)}
            >
              ← {t('common.back')}
            </button>
          )}
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        {selectedGroupId ? (
          <BookmarkList userId={user.uid} groupId={selectedGroupId} />
        ) : (
          <BookmarkGroupList
            userId={user.uid}
            onSelectGroup={setSelectedGroupId}
          />
        )}
      </div>
    </div>
  );
};
