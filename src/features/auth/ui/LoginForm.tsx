import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../model/useAuth';
import { Alert } from '../../../shared/ui';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl w-full">
      <div className="card-body p-4 sm:p-6 md:p-8">
        <h2 className="card-title text-xl sm:text-2xl mb-4">
          {t('auth.login')}
        </h2>

        {error && (
          <Alert type="error" className="mb-4">
            {t('auth.errors.loginFailed')}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-sm md:text-base">
                {t('auth.email')}
              </span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full text-sm md:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder={t('auth.email')}
            />
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text text-sm md:text-base">
                {t('auth.password')}
              </span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full text-sm md:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder={t('auth.password')}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mb-3 text-sm md:text-base"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {t('auth.loggingIn')}
              </>
            ) : (
              t('auth.loginButton')
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
