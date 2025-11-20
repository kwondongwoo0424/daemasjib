interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({
  size = 'md',
  text,
  fullScreen = false
}: LoadingSpinnerProps) => {
  const sizeClass = `loading-${size}`;

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <span className={`loading loading-spinner ${sizeClass}`}></span>
      {text && <p className="text-sm md:text-base text-base-content/60">{text}</p>}
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
