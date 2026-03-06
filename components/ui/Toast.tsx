'use client';

import { useEffect, useState } from 'react';
import type { ToastType } from '@/stores/toast-store';

interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    onDismiss: (id: string) => void;
}

const iconMap: Record<ToastType, string> = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
};

const colorMap: Record<ToastType, string> = {
    success: 'border-success bg-success/10',
    error: 'border-error bg-error/10',
    warning: 'border-warning bg-warning/10',
    info: 'border-info bg-info/10',
};

export default function Toast({ id, type, message, onDismiss }: ToastProps) {
    const [isExiting, setIsExiting] = useState(false);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => onDismiss(id), 200);
    };

    useEffect(() => {
        // Auto-dismiss is handled by the store, but if user re-renders we still want animation
        return () => setIsExiting(false);
    }, []);

    return (
        <div
            className={`
        flex items-center gap-3
        px-4 py-3 rounded-xl
        border-s-4 rtl:border-s-0 rtl:border-e-4
        ${colorMap[type]}
        shadow-lg shadow-black/20
        shadow-sm
        transition-all duration-200
        ${isExiting ? 'opacity-0 translate-x-4 rtl:-translate-x-4' : 'opacity-100 translate-x-0 animate-slide-down'}
      `}
            role="alert"
            aria-live="polite"
        >
            <span className="text-lg shrink-0" aria-hidden="true">
                {iconMap[type]}
            </span>
            <p className="text-sm text-text-primary flex-1 font-medium">{message}</p>
            <button
                onClick={handleDismiss}
                className="p-1 rounded-md text-text-light hover:text-teal hover:bg-white/10 transition-colors shrink-0"
                aria-label="Dismiss"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
