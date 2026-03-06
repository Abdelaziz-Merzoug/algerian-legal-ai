'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Button from '@/components/ui/Button';
import LanguageToggle from '@/components/layout/LanguageToggle';

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 end-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            </div>

            {/* Language toggle */}
            <div className="absolute top-4 end-4">
                <LanguageToggle />
            </div>

            <div className="text-center relative z-10 max-w-md">
                {/* 404 number */}
                <div className="relative mb-6">
                    <h1 className="text-[120px] sm:text-[160px] font-black text-gradient-gold leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl animate-bounce">⚖️</span>
                    </div>
                </div>

                {/* Title & description */}
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
                    {t.notFound.title}
                </h2>
                <p className="text-text-light text-sm mb-8 leading-relaxed">
                    {t.notFound.message}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/">
                        <Button size="md">
                            {t.common.home}
                        </Button>
                    </Link>
                    <Link href="/chat">
                        <Button variant="secondary" size="md">
                            {t.common.chat}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
