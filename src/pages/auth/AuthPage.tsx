import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginForm, RegisterForm } from '../../features/auth';
import { LanguageSwitcher } from '../../shared/ui';

export const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            {t('app.title')}
          </h1>
          <p className="text-sm md:text-base text-base-content/60">
            {t('app.subtitle')}
          </p>
        </div>

        <div className="tabs tabs-boxed mb-4 justify-center">
          <a
            className={`tab text-sm md:text-base ${mode === 'login' ? 'tab-active' : ''}`}
            onClick={() => setMode('login')}
          >
            {t('auth.login')}
          </a>
          <a
            className={`tab text-sm md:text-base ${mode === 'register' ? 'tab-active' : ''}`}
            onClick={() => setMode('register')}
          >
            {t('auth.register')}
          </a>
        </div>

        {mode === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};
