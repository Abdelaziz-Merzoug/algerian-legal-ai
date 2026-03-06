'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullScreen?: boolean;
}

const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
};

export default function LoadingSpinner({
    size = 'md',
    text,
    fullScreen = false,
}: LoadingSpinnerProps) {
    const { t } = useTranslation();

    const content = (
        <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
            <div
                className={`
          ${sizeClasses[size]}
          border-teal/30 border-t-gold
          rounded-full animate-spin
        `}
                aria-hidden="true"
            />
            <p className="text-sm text-text-light animate-pulse-gold">
                {text || t.common.loading}
            </p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 shadow-sm">
                {content}
            </div>
        );
    }

    return content;
}
