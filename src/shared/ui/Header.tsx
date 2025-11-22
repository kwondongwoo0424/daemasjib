import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth';
import { Utensils, Star, Bookmark, Home } from 'lucide-react';
import { toast } from 'react-toastify';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, loading, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: t('home.title'), icon: Home },
    { path: '/visits', label: t('home.visitRecord'), icon: Star },
    { path: '/bookmarks', label: t('home.bookmarks'), icon: Bookmark },
  ];

  const handleNavigation = (path: string) => {
    if (path !== '/' && !user) {
      toast.warning(t('toast.loginRequired'));
      navigate('/auth');
      return;
    }
    navigate(path);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* 좌측: 로고 - 고정 너비 */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Utensils className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 whitespace-nowrap">{t('app.title')}</h1>
          </div>

          {/* 우측: 네비게이션 + 액션 버튼들 */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* 네비게이션 버튼들 */}
            {navItems.map(({ path, label, icon: Icon }) => (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all font-medium min-w-[80px] justify-center ${
                  isActive(path)
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-orange-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive(path) ? 'text-white' : 'text-orange-500'}`} />
                <span className="text-sm">{label}</span>
              </button>
            ))}

            <LanguageSwitcher />

            {loading ? (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="cursor-pointer">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-orange-600 transition-colors">
                    <span className="text-base sm:text-lg font-semibold">{user.email?.[0].toUpperCase()}</span>
                  </div>
                </label>
                <ul tabIndex={0} className="mt-3 z-100 p-2 shadow-lg menu dropdown-content bg-white rounded-xl w-52 border border-gray-200">
                  <li><a onClick={logout} className="text-sm text-red-500 hover:bg-red-50">{t('auth.logout')}</a></li>
                </ul>
              </div>
            ) : (
              <button
                className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
                onClick={() => navigate('/auth')}
              >
                <span className="text-xs sm:text-sm">{t('auth.login')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
