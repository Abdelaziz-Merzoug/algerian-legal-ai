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

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm'
          : 'bg-white'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="text-2xl" aria-label="Scales of justice">
              ⚖️
            </span>
            <span className="hidden text-lg font-bold text-[var(--color-accent)] sm:inline">
              {t.common.appName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            <Link
              href="/categories"
              className="rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
            >
              {t.categories.title}
            </Link>
            <Link
              href="/search"
              className="rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
            >
              {t.common.search}
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
            >
              {t.about.title}
            </Link>
            <div className="mx-1 h-5 w-px bg-gray-200" />
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

          {/* Mobile Hamburger Button */}
          <button
            className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="animate-slide-down border-t border-gray-200 bg-white md:hidden"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="space-y-1 px-4 py-4">
            <Link
              href="/categories"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm text-gray-700 transition-colors hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
            >
              {t.categories.title}
            </Link>
            <Link
              href="/search"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm text-gray-700 transition-colors hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
            >
              {t.common.search}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm text-gray-700 transition-colors hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
            >
              {t.about.title}
            </Link>

            <div className="py-2">
              <LanguageToggle />
            </div>

            {!isLoading && (
              <>
                {user ? (
                  <div className="space-y-1 border-t border-gray-200 pt-3">
                    <Link
                      href="/chat"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-3 text-sm text-gray-700 transition-colors hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
                    >
                      {t.common.chat}
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-3 text-sm text-gray-700 transition-colors hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
                    >
                      {t.dashboard.title}
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-3 text-sm text-gray-700 transition-colors hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
                    >
                      {t.common.profile}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2 border-t border-gray-200 pt-3">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" fullWidth size="md">
                        {t.common.login}
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      <Button variant="primary" fullWidth size="md">
                        {t.common.register}
                      </Button>
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
