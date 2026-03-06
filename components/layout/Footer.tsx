'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function Footer() {
    const { t, language } = useTranslation();
    const year = new Date().getFullYear();

    return (
        <footer className="bg-bg-sidebar text-text-on-dark border-t border-border mt-auto">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">

                    {/* Brand — max-w-xs prevents overflow */}
                    <div className="space-y-4 max-w-xs">
                        <div className="flex items-center gap-2">
                            {/* ⚖️ is the ONLY allowed emoji — logo only */}
                            <span className="text-2xl leading-none" aria-label="scales of justice">⚖️</span>
                            <span className="text-lg font-bold text-white leading-tight">
                                {t.common.appName}
                            </span>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed break-words">
                            {t.common.appDescription}
                        </p>
                        <p className="text-xs text-white/40 leading-relaxed">
                            {language === 'ar' ? 'الجمهورية الجزائرية الديمقراطية الشعبية' : 'People\'s Democratic Republic of Algeria'}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4">
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
                                    <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors leading-relaxed">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4">
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
                                    <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors leading-relaxed">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4">
                            {language === 'ar' ? 'قانوني' : 'Legal'}
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { href: '/privacy', label: t.privacy.title },
                                { href: '/terms', label: t.terms.title },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors leading-relaxed">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <p className="text-xs text-white/30 mt-5 leading-relaxed">
                            {t.chat.disclaimer}
                        </p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/50 leading-relaxed">
                        © {year} {t.common.appName}. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                        <Link href="/privacy" className="hover:text-white transition-colors">{t.privacy.title}</Link>
                        <span aria-hidden="true">•</span>
                        <Link href="/terms" className="hover:text-white transition-colors">{t.terms.title}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
