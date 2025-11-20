import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const ErrorState = ({ message, onRetry, fullScreen = false }: ErrorStateProps) => {
  const { t } = useTranslation();

  const content = (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 text-center">
      <div className="text-4xl md:text-6xl mb-4">⚠️</div>
      <h3 className="text-lg md:text-xl font-semibold mb-2 text-error">
        {message || t('common.error')}
      </h3>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-primary btn-sm md:btn-md mt-4"
        >
          {t('common.retry')}
        </button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        {content}
      </div>
    );
  }

  return content;
};
