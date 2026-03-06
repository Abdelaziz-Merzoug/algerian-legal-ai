'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { useLanguageStore } from '@/stores/language-store';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { t } = useTranslation();
    const { toggleLanguage, language } = useLanguageStore();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy-secondary to-navy p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal/5 rounded-full blur-3xl" />
            </div>

            {/* Language toggle */}
            <button
                onClick={toggleLanguage}
                className="absolute top-4 end-4 rtl:right-auto rtl:start-4 p-2.5 rounded-xl bg-bg-card/80 border border-border text-teal hover:bg-teal-light transition-all duration-200 z-10 inline-flex items-center gap-1.5"
                aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {t.common.switchLanguage}
            </button>

            {/* Auth card */}
            <div className="w-full max-w-md relative z-10">
                <div className="bg-bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl shadow-black/30 p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="text-4xl mb-3">⚖️</div>
                        <h1 className="text-xl font-bold text-gradient-gold">
                            {t.common.appName}
                        </h1>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
