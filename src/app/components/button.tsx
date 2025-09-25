"use client";

import type { ButtonHTMLAttributes, ReactNode } from 'react';

// A simplified Button component tailored for its actual usage in the project.

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  callBack?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'lg';
  children?: ReactNode; // Use children for text content
  text?: string; // Kept for compatibility with login page
}

export default function Button({
  callBack,
  variant = 'primary',
  size = 'default',
  className = '',
  children,
  text,
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) {
  // Base classes for all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Classes for variants that are actually in use
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/90 disabled:bg-grey text-white focus:ring-primary',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100',
  };

  // Classes for sizes that are actually in use
  const sizeClasses = {
    default: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <button
      onClick={callBack}
      type={type}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {children || text}
    </button>
  );
}
