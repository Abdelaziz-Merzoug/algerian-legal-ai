'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        'bg-teal text-white hover:bg-teal-hover active:bg-teal-hover font-semibold shadow-md',
    secondary:
        'bg-white border-2 border-teal text-teal hover:bg-teal-light active:bg-teal-light font-semibold',
    danger:
        'bg-error text-white hover:bg-red-700 active:bg-red-800 font-semibold shadow-md',
    ghost:
        'bg-transparent text-text-secondary hover:bg-bg-card hover:text-teal active:bg-bg-card-hover',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-2 text-sm rounded-lg gap-1.5 min-h-[36px]',
    md: 'px-5 py-3 text-base rounded-xl gap-2 min-h-[44px]',
    lg: 'px-7 py-3.5 text-lg rounded-xl gap-2.5 min-h-[48px]',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            fullWidth = false,
            disabled,
            className = '',
            children,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || isLoading;

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                className={`
          inline-flex items-center justify-center
          transition-all duration-200 ease-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
          cursor-pointer select-none
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin h-4 w-4 shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
export default Button;
