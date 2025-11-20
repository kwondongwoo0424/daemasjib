import { useEffect } from 'react';
import { useAuth } from '../../features/auth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../shared/ui';

export const HomePage = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
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
          <a className="btn btn-ghost text-lg md:text-xl">{t('app.title')}</a>
        </div>
        <div className="flex-none gap-2">
          <LanguageSwitcher />
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-8 md:w-10">
                <span className="text-lg md:text-xl">{user.email?.[0].toUpperCase()}</span>
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><a onClick={() => navigate('/profile')} className="text-sm md:text-base">{user.email}</a></li>
              <li><a onClick={logout} className="text-sm md:text-base">{t('auth.logout')}</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
            onClick={() => navigate('/visits')}
          >
            <div className="card-body p-4 md:p-6">
              <h2 className="card-title text-xl md:text-2xl">{t('home.visits.title')}</h2>
              <p className="text-sm md:text-base">{t('home.visits.description')}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm md:btn-md">
                  {t('home.goButton')}
                </button>
              </div>
            </div>
          </div>

          <div
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
            onClick={() => navigate('/bookmarks')}
          >
            <div className="card-body p-4 md:p-6">
              <h2 className="card-title text-xl md:text-2xl">{t('home.bookmarks.title')}</h2>
              <p className="text-sm md:text-base">{t('home.bookmarks.description')}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm md:btn-md">
                  {t('home.goButton')}
                </button>
              </div>
            </div>
          </div>

          <div
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
            onClick={() => navigate('/restaurants')}
          >
            <div className="card-body p-4 md:p-6">
              <h2 className="card-title text-xl md:text-2xl">{t('home.restaurants.title')}</h2>
              <p className="text-sm md:text-base">{t('home.restaurants.description')}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm md:btn-md">
                  {t('home.goButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
