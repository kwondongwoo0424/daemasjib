import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RestaurantSearch } from '@/features/restaurant';
import { LanguageSwitcher } from '@/shared/ui';

export const RestaurantsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          <a className="btn btn-ghost text-lg md:text-xl">{t('restaurants.title')}</a>
        </div>
        <div className="flex-none">
          <LanguageSwitcher />
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <RestaurantSearch />
      </div>
    </div>
  );
};
