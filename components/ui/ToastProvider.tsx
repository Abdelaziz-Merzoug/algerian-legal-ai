'use client';

import { useToastStore } from '@/stores/toast-store';
import Toast from './Toast';

export default function ToastProvider() {
    const { toasts, removeToast } = useToastStore();

    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed bottom-4 end-4 rtl:right-auto rtl:start-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
            aria-label="Notifications"
        >
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    type={toast.type}
                    message={toast.message}
                    onDismiss={removeToast}
                />
            ))}
        </div>
    );
}
