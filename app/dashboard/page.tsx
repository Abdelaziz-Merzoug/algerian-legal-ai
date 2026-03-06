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

function ChatIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>; }
function BookIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>; }
function FeedbackIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>; }
function SearchDashIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>; }
function MessageStatIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>; }
function CalendarIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>; }

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
        { href: '/chat', Icon: ChatIcon, label: t.dashboard.newChat, color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
        { href: '/categories', Icon: BookIcon, label: t.dashboard.browseLaws, color: 'from-green-500/20 to-green-600/10 border-green-500/30' },
        { href: '/feedback', Icon: FeedbackIcon, label: t.dashboard.sendFeedback, color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30' },
        { href: '/search', Icon: SearchDashIcon, label: t.common.search, color: 'from-gold/20 to-gold/10 border-teal/30' },
    ];

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar />
            <main className="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                        {t.dashboard.welcome}، {isLoading ? '...' : data?.username}
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
                                { label: t.profile.totalConversations, value: data?.totalConversations || 0, Icon: ChatIcon },
                                { label: t.profile.totalMessages, value: data?.totalMessages || 0, Icon: MessageStatIcon },
                                { label: t.profile.memberSince, value: data?.memberSince ? new Date(data.memberSince).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'en-US', { year: 'numeric', month: 'short' }) : '-', Icon: CalendarIcon },
                            ].map((stat, i) => (
                                <div key={i} className="bg-bg-card shadow-sm border border-border-light rounded-xl p-5 text-center">
                                    <div className="flex items-center justify-center mb-2 text-teal">
                                        <stat.Icon />
                                    </div>
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
                                    <div className="flex items-center justify-center mb-2 text-text-primary">
                                        <action.Icon />
                                    </div>
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
                                        <div className="flex-1 min-w-0 flex items-center gap-3">
                                            <div className="text-teal shrink-0">
                                                <ChatIcon />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-sm font-medium text-text-primary truncate">
                                                    {conv.title || (language === 'ar' ? 'محادثة جديدة' : 'New conversation')}
                                                </h3>
                                                <p className="text-[10px] text-text-light mt-0.5">
                                                    {new Date(conv.updated_at || conv.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-teal font-medium flex-shrink-0 ms-3">{t.dashboard.resumeChat} →</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-bg-card/30 rounded-xl border border-border-light">
                            <div className="flex items-center justify-center mb-2 text-text-muted">
                                <ChatIcon />
                            </div>
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
