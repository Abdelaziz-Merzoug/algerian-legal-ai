'use client';

import { useLanguageStore } from '@/stores/language-store';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function LanguageToggle() {
  const { toggleLanguage, language } = useLanguageStore();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-[var(--color-primary)] transition-all duration-200 hover:border-[var(--color-primary)]/20 hover:bg-[var(--color-primary-light)]"
      aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <span className="shrink-0 text-lg" aria-hidden="true">
        🌐
      </span>
      <span className="hidden sm:inline">{t.common.switchLanguage}</span>
    </button>
  );
}
