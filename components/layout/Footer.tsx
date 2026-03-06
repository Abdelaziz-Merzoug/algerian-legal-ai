'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function Footer() {
  const { t, language } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-[var(--color-primary)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="max-w-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none" aria-label="Scales of justice">
                ⚖️
              </span>
              <span className="text-lg font-bold leading-tight text-[var(--color-accent)]">
                {t.common.appName}
              </span>
            </div>
            <p className="break-words text-sm leading-relaxed text-white/70">
              {t.common.appDescription}
            </p>
            <p className="text-xs leading-relaxed text-white/50">
              {language === 'ar'
                ? 'الجمهورية الجزائرية الديمقراطية الشعبية'
                : "People's Democratic Republic of Algeria"}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: t.common.home },
                { href: '/chat', label: t.common.chat },
                { href: '/categories', label: t.categories.title },
                { href: '/search', label: t.common.search },
                { href: '/dashboard', label: t.dashboard.title },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm leading-relaxed text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">
              {language === 'ar' ? 'عن المنصة' : 'About'}
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/about', label: t.about.title },
                { href: '/faq', label: t.faq.title },
                { href: '/contact', label: t.contact.title },
                { href: '/feedback', label: t.feedback.title },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm leading-relaxed text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">
              {language === 'ar' ? 'قانوني' : 'Legal'}
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/privacy', label: t.privacy.title },
                { href: '/terms', label: t.terms.title },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm leading-relaxed text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-white/40">
              {t.chat.disclaimer}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs leading-relaxed text-white/50">
            © {year} {t.common.appName}.{' '}
            {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <Link href="/privacy" className="transition-colors hover:text-white">
              {t.privacy.title}
            </Link>
            <span aria-hidden="true">•</span>
            <Link href="/terms" className="transition-colors hover:text-white">
              {t.terms.title}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
