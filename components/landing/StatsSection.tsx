'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface Stats {
    totalDocuments: number;
    totalArticles: number;
    totalUsers: number;
    totalConversations: number;
}

function AnimatedNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (value === 0) return;
        const start = 0;
        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(start + (value - start) * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [value, duration]);

    return <>{display.toLocaleString()}</>;
}

function BookStatIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    );
}
function ScrollStatIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}
function UsersStatIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}
function ChatStatIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    );
}

export default function StatsSection() {
    const { t } = useTranslation();
    const [stats, setStats] = useState<Stats>({
        totalDocuments: 0,
        totalArticles: 0,
        totalUsers: 0,
        totalConversations: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/stats/public');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch {
                // Use fallback numbers
                setStats({
                    totalDocuments: 50,
                    totalArticles: 2500,
                    totalUsers: 100,
                    totalConversations: 500,
                });
            }
        };
        fetchStats();
    }, []);

    const statItems = [
        { Icon: BookStatIcon, value: stats.totalDocuments, label: t.landing.statDocuments },
        { Icon: ScrollStatIcon, value: stats.totalArticles, label: t.landing.statArticles },
        { Icon: UsersStatIcon, value: stats.totalUsers, label: t.landing.statUsers },
        { Icon: ChatStatIcon, value: stats.totalConversations, label: t.landing.statConversations },
    ];

    return (
        <section className="py-16 relative">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="bg-bg-card shadow-sm border border-border rounded-2xl p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {statItems.map(({ Icon, value, label }, idx) => (
                            <div key={idx} className="text-center">
                                <div className="flex items-center justify-center mb-2 text-teal">
                                    <Icon />
                                </div>
                                <div className="text-3xl sm:text-4xl font-black text-gradient-gold mb-1">
                                    <AnimatedNumber value={value} />+
                                </div>
                                <p className="text-sm text-text-light">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
