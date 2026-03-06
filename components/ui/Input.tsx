'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, endIcon, className = '', id, ...props }, ref) => {
        const { direction } = useTranslation();
        const [focused, setFocused] = useState(false);
        const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase() || 'field'}`;

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-text-light"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <span
                            className={`absolute top-1/2 -translate-y-1/2 text-text-light pointer-events-none ${direction === 'rtl' ? 'end-3' : 'start-3'
                                }`}
                            aria-hidden="true"
                        >
                            {icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        onFocus={(e) => {
                            setFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setFocused(false);
                            props.onBlur?.(e);
                        }}
                        className={`
              w-full px-4 py-3 min-h-[44px]
              bg-bg-card border rounded-xl
              text-base text-text-primary placeholder-text-muted
              transition-all duration-200
              focus:outline-none leading-relaxed
              ${icon ? (direction === 'rtl' ? 'pe-10' : 'ps-10') : ''}
              ${endIcon ? (direction === 'rtl' ? 'ps-10' : 'pe-10') : ''}
              ${error
                                ? 'border-error focus:ring-2 focus:ring-error/30'
                                : focused
                                    ? 'border-teal ring-2 ring-teal/20'
                                    : 'border-border hover:border-teal/50'
                            }
              ${className}
            `}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${inputId}-error` : undefined}
                        {...props}
                    />
                    {endIcon && (
                        <span
                            className={`absolute top-1/2 -translate-y-1/2 text-text-light ${direction === 'rtl' ? 'start-3' : 'end-3'
                                }`}
                        >
                            {endIcon}
                        </span>
                    )}
                </div>
                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="text-sm text-error flex items-center gap-1"
                        role="alert"
                    >
                        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;
