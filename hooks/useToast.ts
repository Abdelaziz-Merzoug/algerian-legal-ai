'use client';

import { useToastStore } from '@/stores/toast-store';
import type { ToastType } from '@/stores/toast-store';

/**
 * Convenience hook for showing toast notifications.
 *
 * Usage:
 *   const toast = useToast();
 *   toast.success('Saved!');
 *   toast.error('Something went wrong');
 */
export function useToast() {
    const addToast = useToastStore((state) => state.addToast);

    return {
        success: (message: string, duration?: number) =>
            addToast({ type: 'success', message, duration }),
        error: (message: string, duration?: number) =>
            addToast({ type: 'error', message, duration }),
        warning: (message: string, duration?: number) =>
            addToast({ type: 'warning', message, duration }),
        info: (message: string, duration?: number) =>
            addToast({ type: 'info', message, duration }),
        custom: (type: ToastType, message: string, duration?: number) =>
            addToast({ type, message, duration }),
    };
}
