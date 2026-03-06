'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { BookIcon, DocumentIcon, PeopleIcon, ChatIcon } from '@/components/icons/LegalIcons';

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const start = Date.now();
                    const step = () => {
                        const elapsed = Date.now() - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return <div ref={ref}>{count.toLocaleString()}</div>;
}

interface Stats {
    totalDocuments: number;
    totalArticles: number;
    totalUsers: number;
    totalConversations: number;
}

export default function DynamicStats() {
    const { t } = useTranslation();
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        fetch('/api/stats')
            .then((r) => r.json())
            .then((data) => setStats(data))
            .catch(() => { });
    }, []);

    const items = [
        { label: t.landing.statDocuments, value: stats?.totalDocuments || 0, Icon: BookIcon },
        { label: t.landing.statArticles, value: stats?.totalArticles || 0, Icon: DocumentIcon },
        { label: t.landing.statUsers, value: stats?.totalUsers || 0, Icon: PeopleIcon },
        { label: t.landing.statConversations, value: stats?.totalConversations || 0, Icon: ChatIcon },
    ];

    return (
        <section className="py-16 md:py-24 px-6 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4 leading-tight">
                        {t.landing.statsTitle}
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {items.map(({ label, value, Icon }, idx) => (
                        <div
                            key={idx}
                            className="bg-white border border-border rounded-xl p-6 md:p-8 text-center hover:border-teal/40 hover:shadow-md transition-all duration-200 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-teal/20 transition-colors">
                                <Icon className="w-6 h-6 text-teal" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-teal mb-1">
                                <AnimatedCounter target={value} />
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
