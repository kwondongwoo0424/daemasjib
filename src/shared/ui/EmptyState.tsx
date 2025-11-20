import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export const EmptyState = ({ title, description, action, icon }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] p-4 md:p-8 text-center">
      {icon && <div className="mb-4 text-4xl md:text-6xl opacity-30">{icon}</div>}
      <h3 className="text-lg md:text-xl font-semibold mb-2 text-base-content">
        {title}
      </h3>
      {description && (
        <p className="text-sm md:text-base text-base-content/60 mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && <div className="w-full sm:w-auto">{action}</div>}
    </div>
  );
};
