'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/lib/i18n/useTranslation';
import LanguageToggle from './LanguageToggle';
import ProfileDropdown from './ProfileDropdown';
import Button from '@/components/ui/Button';

export default function Navbar() {
    const { user, isLoading } = useAuth();
    const { t } = useTranslation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setMobileOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <nav
            className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-xl border-b border-border shadow-sm'
                : 'bg-white'
                }`}
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <span className="text-2xl">⚖️</span>
                        <span className="text-lg font-bold text-gradient-gold hidden sm:inline">
                            {t.common.appName}
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link href="/categories" className="px-3 py-2.5 text-sm text-text-secondary hover:text-teal transition-colors rounded-lg hover:bg-teal-light">
                            {t.categories.title}
                        </Link>
                        <Link href="/search" className="px-3 py-2.5 text-sm text-text-secondary hover:text-teal transition-colors rounded-lg hover:bg-teal-light">
                            {t.common.search}
                        </Link>
                        <Link href="/about" className="px-3 py-2.5 text-sm text-text-secondary hover:text-teal transition-colors rounded-lg hover:bg-teal-light">
                            {t.about.title}
                        </Link>
                        <div className="w-px h-5 bg-border mx-1" />
                        <LanguageToggle />

                        {!isLoading && (
                            <>
                                {user ? (
                                    <ProfileDropdown />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link href="/login">
                                            <Button variant="ghost" size="sm">
                                                {t.common.login}
                                            </Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button variant="primary" size="sm">
                                                {t.common.register}
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-lg text-text-secondary hover:text-teal hover:bg-teal-light transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu — full overlay */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-border animate-slide-down">
                    <div className="px-4 py-4 space-y-1">
                        <Link href="/categories" onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-lg text-text-secondary hover:text-teal hover:bg-teal-light transition-colors">
                            {t.categories.title}
                        </Link>
                        <Link href="/search" onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-lg text-text-secondary hover:text-teal hover:bg-teal-light transition-colors">
                            {t.common.search}
                        </Link>
                        <Link href="/about" onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-lg text-text-secondary hover:text-teal hover:bg-teal-light transition-colors">
                            {t.about.title}
                        </Link>

                        <LanguageToggle />

                        {!isLoading && (
                            <>
                                {user ? (
                                    <div className="space-y-1 pt-2 border-t border-border-light">
                                        <Link href="/chat" onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-lg text-text-secondary hover:text-teal hover:bg-teal-light transition-colors">
                                            {t.common.chat}
                                        </Link>
                                        <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-lg text-text-secondary hover:text-teal hover:bg-teal-light transition-colors">
                                            {t.dashboard.title}
                                        </Link>
                                        <Link href="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-lg text-text-secondary hover:text-teal hover:bg-teal-light transition-colors">
                                            {t.common.profile}
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-2 pt-3 border-t border-border-light">
                                        <Link href="/login" onClick={() => setMobileOpen(false)}>
                                            <Button variant="ghost" fullWidth size="md">{t.common.login}</Button>
                                        </Link>
                                        <Link href="/register" onClick={() => setMobileOpen(false)}>
                                            <Button variant="primary" fullWidth size="md">{t.common.register}</Button>
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
