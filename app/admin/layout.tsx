'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/lib/i18n/useTranslation';
import LanguageToggle from '@/components/layout/LanguageToggle';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const navItems = [
    { href: '/admin', icon: '📊', key: 'dashboard' as const },
    { href: '/admin/categories', icon: '📁', key: 'categories' as const },
    { href: '/admin/laws', icon: '📚', key: 'laws' as const },
    { href: '/admin/users', icon: '👥', key: 'users' as const },
    { href: '/admin/feedback', icon: '💬', key: 'feedback' as const },
    { href: '/admin/contact', icon: '✉️', label_ar: 'رسائل التواصل', label_en: 'Contact' },
    { href: '/admin/analytics', icon: '📈', label_ar: 'التحليلات', label_en: 'Analytics' },
    { href: '/admin/settings', icon: '⚙️', label_ar: 'إعدادات المنصة', label_en: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { t, language } = useTranslation();
    const { user, isLoading, isAdmin } = useAuth();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (isLoading) return <LoadingSpinner fullScreen />;

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <div className="text-5xl">🔒</div>
                    <h1 className="text-xl font-bold text-text-primary">{t.errors.unauthorized}</h1>
                    <Link href="/" className="text-teal hover:text-teal-hover transition-colors">
                        {t.common.home}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary flex">
            {/* Sidebar */}
            <aside
                className={`
          w-60 shrink-0 bg-bg-sidebar border-e border-border flex flex-col
          fixed inset-y-0 start-0 z-30 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'}
          md:translate-x-0 md:relative
        `}
            >
                {/* Logo */}
                <div className="p-4 border-b border-white/10">
                    <Link href="/admin" className="flex items-center gap-2">
                        <span className="text-xl">⚖️</span>
                        <span className="text-sm font-bold text-white">{t.common.admin}</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${isActive
                                    ? 'bg-white/15 text-white border border-white/20 font-medium'
                                    : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span>{'key' in item && item.key ? t.admin[item.key] : (language === 'ar' ? (item as { label_ar?: string }).label_ar : (item as { label_en?: string }).label_en)}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="p-3 border-t border-white/10 space-y-2">
                    <LanguageToggle />
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 text-xs text-white/60 hover:text-white transition-colors"
                    >
                        ← {t.common.home}
                    </Link>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-20"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main */}
            <div className="flex-1 min-w-0">
                {/* Top bar */}
                <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
                    <button
                        className="md:hidden p-2 rounded-lg text-text-light hover:text-teal hover:bg-bg-card transition-colors"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="text-sm text-text-light">
                        {user.email}
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
