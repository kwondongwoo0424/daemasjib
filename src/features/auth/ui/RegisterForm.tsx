import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../model/useAuth';
import { Alert } from '../../../shared/ui';

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);
  const { register, loading, error } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMismatchError(false);

    if (password !== confirmPassword) {
      setPasswordMismatchError(true);
      return;
    }

    try {
      await register(email, password);
    } catch (err) {
      console.error('Register failed:', err);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl w-full">
      <div className="card-body p-4 sm:p-6 md:p-8">
        <h2 className="card-title text-xl sm:text-2xl mb-4">
          {t('auth.register')}
        </h2>

        {error && (
          <Alert type="error" className="mb-4">
            {t('auth.errors.registerFailed')}
          </Alert>
        )}

        {passwordMismatchError && (
          <Alert type="error" className="mb-4">
            {t('auth.errors.passwordMismatch')}
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

          <div className="form-control mb-4">
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
              minLength={6}
              placeholder={t('auth.password')}
            />
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text text-sm md:text-base">
                {t('auth.confirmPassword')}
              </span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full text-sm md:text-base"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              placeholder={t('auth.confirmPassword')}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full text-sm md:text-base"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {t('auth.registering')}
              </>
            ) : (
              t('auth.registerButton')
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
