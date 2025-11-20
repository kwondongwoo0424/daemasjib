import type { ReactNode } from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert = ({ type, children, onClose, className = '' }: AlertProps) => {
  const alertTypes = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info'
  };

  return (
    <div className={`alert ${alertTypes[type]} ${className}`} role="alert">
      <span className="text-sm md:text-base">{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="btn btn-sm btn-ghost btn-circle"
          aria-label="Close"
        >
          ✕
        </button>
      )}
    </div>
  );
};
