'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { SkeletonStats } from '@/components/ui/SkeletonLoader';

interface DashboardData {
    username: string;
    totalConversations: number;
    totalMessages: number;
    memberSince: string;
    recentConversations: { id: string; title: string; created_at: string; updated_at: string }[];
}

export default function DashboardPage() {
    const { t, language } = useTranslation();
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard')
            .then((r) => r.json())
            .then((d) => setData(d))
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, []);

    const quickActions = [
        { href: '/chat', icon: '💬', label: t.dashboard.newChat, color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
        { href: '/categories', icon: '📚', label: t.dashboard.browseLaws, color: 'from-green-500/20 to-green-600/10 border-green-500/30' },
        { href: '/feedback', icon: '📝', label: t.dashboard.sendFeedback, color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30' },
        { href: '/search', icon: '🔍', label: t.common.search, color: 'from-gold/20 to-gold/10 border-teal/30' },
    ];

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar />
            <main className="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                        {t.dashboard.welcome}، {isLoading ? '...' : data?.username} 👋
                    </h1>
                    {data?.memberSince && (
                        <p className="text-xs text-text-light mt-1">
                            {t.profile.memberSince}: {new Date(data.memberSince).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'en-US')}
                        </p>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="mb-10">
                    <h2 className="text-sm font-semibold text-text-light mb-4">{t.dashboard.quickStats}</h2>
                    {isLoading ? (
                        <SkeletonStats count={3} />
                    ) : (
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: t.profile.totalConversations, value: data?.totalConversations || 0, icon: '💬' },
                                { label: t.profile.totalMessages, value: data?.totalMessages || 0, icon: '📨' },
                                { label: t.profile.memberSince, value: data?.memberSince ? new Date(data.memberSince).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'en-US', { year: 'numeric', month: 'short' }) : '-', icon: '📅' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-bg-card shadow-sm border border-border-light rounded-xl p-5 text-center">
                                    <div className="text-2xl mb-2">{stat.icon}</div>
                                    <div className="text-xl font-bold text-gradient-gold">{stat.value}</div>
                                    <p className="text-[10px] text-text-light mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="mb-10">
                    <h2 className="text-sm font-semibold text-text-light mb-4">{t.dashboard.quickActions}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {quickActions.map((action) => (
                            <Link key={action.href} href={action.href}>
                                <div className={`bg-gradient-to-br ${action.color} border rounded-xl p-4 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-lg cursor-pointer`}>
                                    <div className="text-2xl mb-2">{action.icon}</div>
                                    <span className="text-xs font-medium text-text-primary">{action.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Conversations */}
                <div>
                    <h2 className="text-sm font-semibold text-text-light mb-4">{t.dashboard.recentConversations}</h2>
                    {isLoading ? (
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-bg-card border border-border rounded-xl p-4 animate-pulse h-16" />
                            ))}
                        </div>
                    ) : data?.recentConversations?.length ? (
                        <div className="space-y-2">
                            {data.recentConversations.map((conv) => (
                                <Link key={conv.id} href={`/chat?c=${conv.id}`}>
                                    <div className="bg-bg-card shadow-sm border border-border-light rounded-xl p-4 flex items-center justify-between transition-all hover:border-teal/30 hover:bg-bg-card cursor-pointer">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-text-primary truncate">
                                                💬 {conv.title || (language === 'ar' ? 'محادثة جديدة' : 'New conversation')}
                                            </h3>
                                            <p className="text-[10px] text-text-light mt-0.5">
                                                {new Date(conv.updated_at || conv.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <span className="text-xs text-teal font-medium flex-shrink-0 ms-3">{t.dashboard.resumeChat} →</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-bg-card/30 rounded-xl border border-border-light">
                            <div className="text-3xl mb-2">💬</div>
                            <p className="text-sm text-text-light">{t.dashboard.noRecentConversations}</p>
                            <Link href="/chat" className="inline-block mt-3 text-teal text-sm hover:text-teal transition-colors">
                                {t.dashboard.newChat} →
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
