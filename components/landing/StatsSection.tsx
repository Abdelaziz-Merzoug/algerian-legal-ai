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
        { icon: '📚', value: stats.totalDocuments, label: t.landing.statDocuments },
        { icon: '📜', value: stats.totalArticles, label: t.landing.statArticles },
        { icon: '👥', value: stats.totalUsers, label: t.landing.statUsers },
        { icon: '💬', value: stats.totalConversations, label: t.landing.statConversations },
    ];

    return (
        <section className="py-16 relative">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="bg-bg-card shadow-sm border border-border rounded-2xl p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {statItems.map((item, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-3xl mb-2">{item.icon}</div>
                                <div className="text-3xl sm:text-4xl font-black text-gradient-gold mb-1">
                                    <AnimatedNumber value={item.value} />+
                                </div>
                                <p className="text-sm text-text-light">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
