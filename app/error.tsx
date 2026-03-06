'use client';

import { useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Button from '@/components/ui/Button';
import LanguageToggle from '@/components/layout/LanguageToggle';
import { WarningIcon, RefreshIcon, HomeIcon } from '@/components/ui/Icon';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const { t } = useTranslation();

    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 start-1/3 w-80 h-80 bg-error/5 rounded-full blur-3xl" />
            </div>

            {/* Language toggle */}
            <div className="absolute top-4 end-4">
                <LanguageToggle />
            </div>

            <div className="text-center relative z-10 max-w-md">
                {/* Error icon — SVG, no emoji */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-error/10 border border-error/30 flex items-center justify-center">
                    <WarningIcon className="w-8 h-8 text-error" />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-text-primary mb-3">
                    {t.errorPage.title}
                </h1>
                <p className="text-text-light text-sm mb-6 leading-relaxed">
                    {t.errorPage.message}
                </p>

                {/* Error details (dev only) */}
                {process.env.NODE_ENV === 'development' && error.message && (
                    <div className="bg-error/10 border border-error/30 rounded-xl p-3 mb-6 text-start">
                        <p className="text-xs text-error font-mono break-all">{error.message}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={reset} size="md">
                        <RefreshIcon className="w-4 h-4 inline me-1.5" />
                        {t.errorPage.retry}
                    </Button>
                    <Button variant="secondary" size="md" onClick={() => (window.location.href = '/')}>
                        <HomeIcon className="w-4 h-4 inline me-1.5" />
                        {t.common.home}
                    </Button>
                </div>
            </div>
        </div>
    );
}
