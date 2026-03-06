'use client';

import { SelectHTMLAttributes, forwardRef, useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, placeholder, className = '', id, ...props }, ref) => {
        const { direction } = useTranslation();
        const [focused, setFocused] = useState(false);
        const selectId = id || `select-${label?.replace(/\s+/g, '-').toLowerCase() || 'field'}`;

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-text-light"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        id={selectId}
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
              text-base text-text-primary
              transition-all duration-200
              focus:outline-none
              appearance-none cursor-pointer
              ${direction === 'rtl' ? 'ps-10' : 'pe-10'}
              ${error
                                ? 'border-error focus:ring-2 focus:ring-error/30'
                                : focused
                                    ? 'border-teal ring-2 ring-teal/20'
                                    : 'border-border hover:border-teal/50'
                            }
              ${className}
            `}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${selectId}-error` : undefined}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled className="text-text-light">
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                className="bg-bg-card text-text-primary"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {/* Dropdown arrow */}
                    <span
                        className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-text-light ${direction === 'rtl' ? 'start-3' : 'end-3'
                            }`}
                        aria-hidden="true"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </span>
                </div>
                {error && (
                    <p
                        id={`${selectId}-error`}
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

Select.displayName = 'Select';
export default Select;
