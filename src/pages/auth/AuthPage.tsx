import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginForm, RegisterForm, useAuth } from '@/features/auth';
import { LanguageSwitcher } from '@/shared/ui';
import { Utensils } from 'lucide-react';

export const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Utensils className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              {t('app.title')}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            {t('app.subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-3 sm:py-4 text-sm sm:text-base font-medium transition-colors ${
                mode === 'login'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setMode('login')}
            >
              {t('auth.login')}
            </button>
            <button
              className={`flex-1 py-3 sm:py-4 text-sm sm:text-base font-medium transition-colors ${
                mode === 'register'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setMode('register')}
            >
              {t('auth.register')}
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {mode === 'login' ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
          >
            {t('auth.backToHome')}
          </button>
        </div>
      </div>
    </div>
  );
};
