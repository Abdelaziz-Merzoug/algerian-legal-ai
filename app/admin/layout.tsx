'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/lib/i18n/useTranslation';
import LanguageToggle from '@/components/layout/LanguageToggle';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// SVG icon components for admin sidebar
function DashboardIcon() {
    return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-3a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
        </svg>
    );
}
function FolderIcon() {
    return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
        </svg>
    );
}
function BookIcon() {
    return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    );
}
function UsersNavIcon() {
    return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}
function MessageSquareIcon() {
    return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
    );
}
function MailIcon() {
    return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}
function ChartIcon() {
    return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    );
}
function SettingsIcon() {
    return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}
function LockNavIcon() {
    return (
        <svg className="w-12 h-12 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    );
}

type NavKey = 'dashboard' | 'categories' | 'laws' | 'users' | 'feedback';

interface NavItemWithKey {
    href: string;
    Icon: () => React.JSX.Element;
    key: NavKey;
}
interface NavItemWithLabel {
    href: string;
    Icon: () => React.JSX.Element;
    label_ar: string;
    label_en: string;
}
type NavItem = NavItemWithKey | NavItemWithLabel;

function isNavItemWithKey(item: NavItem): item is NavItemWithKey {
    return 'key' in item;
}

const navItems: NavItem[] = [
    { href: '/admin', Icon: DashboardIcon, key: 'dashboard' },
    { href: '/admin/categories', Icon: FolderIcon, key: 'categories' },
    { href: '/admin/laws', Icon: BookIcon, key: 'laws' },
    { href: '/admin/users', Icon: UsersNavIcon, key: 'users' },
    { href: '/admin/feedback', Icon: MessageSquareIcon, key: 'feedback' },
    { href: '/admin/contact', Icon: MailIcon, label_ar: 'رسائل التواصل', label_en: 'Contact' },
    { href: '/admin/analytics', Icon: ChartIcon, label_ar: 'التحليلات', label_en: 'Analytics' },
    { href: '/admin/settings', Icon: SettingsIcon, label_ar: 'إعدادات المنصة', label_en: 'Settings' },
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
                    <LockNavIcon />
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
                        const label = isNavItemWithKey(item)
                            ? t.admin[item.key]
                            : (language === 'ar' ? item.label_ar : item.label_en);
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
                                <item.Icon />
                                <span>{label}</span>
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
