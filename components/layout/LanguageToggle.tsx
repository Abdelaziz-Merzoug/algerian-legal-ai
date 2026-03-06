'use client';

import { useLanguageStore } from '@/stores/language-store';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function LanguageToggle() {
    const { toggleLanguage, language } = useLanguageStore();
    const { t } = useTranslation();

    return (
        <button
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-teal hover:bg-teal-light transition-all duration-200 border border-transparent hover:border-teal/20"
            aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
        >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>{t.common.switchLanguage}</span>
        </button>
    );
}
