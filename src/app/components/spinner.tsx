"use client";

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  label?: string;
}

const Spinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  label = 'Loading...'
}: SpinnerProps) => {
  const sizeClasses = {
    xs: 'w-3 h-3 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const colorClasses = {
    primary: 'border-grey border-t-primary',
    secondary: 'border-gray-200 border-t-gray-600',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-300 border-t-gray-700'
  };

  const spinnerClasses = `${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin ${className}`.trim();

  return (
    <div className="flex justify-center items-center">
      <div 
        className={spinnerClasses}
        role="status" 
        aria-label={label}
      >
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
};

export default Spinner;