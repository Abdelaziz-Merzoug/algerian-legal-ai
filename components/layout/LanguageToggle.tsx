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
            <span className="text-base">🌐</span>
            <span>{t.common.switchLanguage}</span>
        </button>
    );
}
