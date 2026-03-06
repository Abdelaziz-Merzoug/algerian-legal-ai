'use client';

import { useLanguageStore } from '@/stores/language-store';
import { translations, type TranslationKeys } from './translations';

/**
 * Hook that provides access to translated strings based on the current language.
 *
 * Usage:
 *   const { t, language, direction } = useTranslation();
 *   <h1>{t.common.appName}</h1>
 */
export function useTranslation() {
    const { language, direction } = useLanguageStore();

    const t: TranslationKeys = translations[language];

    return {
        t,
        language,
        direction,
        isRtl: direction === 'rtl',
    };
}
