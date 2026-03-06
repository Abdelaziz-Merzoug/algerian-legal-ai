'use client';

import { TextareaHTMLAttributes, forwardRef, useState, useEffect, useRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    autoResize?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, autoResize = true, className = '', id, ...props }, ref) => {
        const [focused, setFocused] = useState(false);
        const internalRef = useRef<HTMLTextAreaElement | null>(null);
        const textareaId = id || `textarea-${label?.replace(/\s+/g, '-').toLowerCase() || 'field'}`;

        // Auto-resize logic
        useEffect(() => {
            const el = internalRef.current;
            if (!autoResize || !el) return;

            const resize = () => {
                el.style.height = 'auto';
                el.style.height = `${el.scrollHeight}px`;
            };
            resize();

            el.addEventListener('input', resize);
            return () => el.removeEventListener('input', resize);
        }, [autoResize, props.value]);

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-text-light"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={(node) => {
                        internalRef.current = node;
                        if (typeof ref === 'function') ref(node);
                        else if (ref) ref.current = node;
                    }}
                    id={textareaId}
                    onFocus={(e) => {
                        setFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        props.onBlur?.(e);
                    }}
                    className={`
            w-full px-4 py-3
            bg-bg-card border rounded-xl
            text-base text-text-primary placeholder-text-muted
            transition-all duration-200
            focus:outline-none leading-relaxed
            min-h-[100px] resize-none
            ${error
                            ? 'border-error focus:ring-2 focus:ring-error/30'
                            : focused
                                ? 'border-teal ring-2 ring-teal/20'
                                : 'border-border hover:border-teal/50'
                        }
            ${className}
          `}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${textareaId}-error` : undefined}
                    {...props}
                />
                {error && (
                    <p
                        id={`${textareaId}-error`}
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

Textarea.displayName = 'Textarea';
export default Textarea;
