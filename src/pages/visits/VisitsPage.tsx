import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/auth';
import { VisitList, CreateVisitForm } from '../../features/visit';
import { LanguageSwitcher } from '../../shared/ui';

export const VisitsPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
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
          <a className="btn btn-ghost text-lg md:text-xl">{t('visits.title')}</a>
        </div>
        <div className="flex-none gap-2">
          <LanguageSwitcher />
          <button
            className="btn btn-primary btn-sm md:btn-md text-xs md:text-sm"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? t('common.cancel') : `+ ${t('visits.addVisit')}`}
          </button>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        {showCreateForm && (
          <div className="mb-6 md:mb-8">
            <CreateVisitForm
              userId={user.uid}
              onSuccess={() => setShowCreateForm(false)}
            />
          </div>
        )}

        <VisitList userId={user.uid} />
      </div>
    </div>
  );
};
