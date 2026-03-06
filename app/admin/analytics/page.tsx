'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import BarChart from '@/components/ui/BarChart';
import Badge from '@/components/ui/Badge';

interface AnalyticsData {
    totals: {
        users: number;
        documents: number;
        articles: number;
        conversations: number;
        messages: number;
        feedback: number;
        contacts: number;
    };
    dailyStats: { label: string; value: number }[];
    feedbackByType: Record<string, number>;
    recentUsers: { id: string; username: string; email: string; created_at: string }[];
    recentFeedback: { id: string; subject: string; type: string; status: string; rating: number | null; created_at: string; profiles: { username: string } | null }[];
}

const feedbackStatusMap: Record<string, 'warning' | 'default' | 'success' | 'error'> = {
    pending: 'warning',
    reviewed: 'default',
    resolved: 'success',
    dismissed: 'error',
};

export default function AdminAnalyticsPage() {
    const { t, language } = useTranslation();
    const { isLoading: authLoading } = useAuth();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/analytics')
            .then((r) => r.json())
            .then((d) => setData(d))
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, []);

    if (authLoading) return <LoadingSpinner fullScreen />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gradient-gold">{t.adminAnalytics.title}</h1>
                <p className="text-text-light text-sm mt-1">{t.adminAnalytics.subtitle}</p>
            </div>

            {isLoading || !data ? (
                <div className="flex justify-center py-12"><LoadingSpinner /></div>
            ) : (
                <>
                    {/* Stat cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                        {[
                            { label: language === 'ar' ? 'مستخدمين' : 'Users', value: data.totals.users, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
                            { label: language === 'ar' ? 'نصوص' : 'Docs', value: data.totals.documents, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
                            { label: language === 'ar' ? 'مواد' : 'Articles', value: data.totals.articles, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
                            { label: language === 'ar' ? 'محادثات' : 'Chats', value: data.totals.conversations, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
                            { label: language === 'ar' ? 'رسائل' : 'Messages', value: data.totals.messages, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> },
                            { label: language === 'ar' ? 'ملاحظات' : 'Feedback', value: data.totals.feedback, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
                            { label: language === 'ar' ? 'رسائل تواصل' : 'Contacts', value: data.totals.contacts, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                        ].map((stat, i) => (
                            <div key={i} className="bg-bg-card border border-border-light rounded-xl p-4 text-center">
                                <div className="flex items-center justify-center mb-1 text-teal">{stat.icon}</div>
                                <div className="text-lg font-bold text-gradient-gold">{stat.value}</div>
                                <p className="text-[10px] text-text-light">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Charts row */}
                    <div className="grid md:grid-cols-2 gap-5">
                        {/* Daily conversations chart */}
                        <div className="bg-bg-card border border-border-light rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-text-primary mb-4">
                                {language === 'ar' ? 'المحادثات (آخر 7 أيام)' : 'Conversations (Last 7 Days)'}
                            </h3>
                            <BarChart data={data.dailyStats} barColor="bg-teal" />
                        </div>

                        {/* Feedback by type */}
                        <div className="bg-bg-card border border-border-light rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-text-primary mb-4">
                                {language === 'ar' ? 'الملاحظات حسب النوع' : 'Feedback by Type'}
                            </h3>
                            {Object.keys(data.feedbackByType).length > 0 ? (
                                <BarChart
                                    data={Object.entries(data.feedbackByType).map(([label, value]) => ({ label, value }))}
                                    barColor="bg-blue-400"
                                />
                            ) : (
                                <p className="text-xs text-text-light text-center py-8">{t.common.noResults}</p>
                            )}
                        </div>
                    </div>

                    {/* Recent users & feedback */}
                    <div className="grid md:grid-cols-2 gap-5">
                        {/* Recent users */}
                        <div className="bg-bg-card border border-border-light rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-text-primary mb-4">
                                {language === 'ar' ? 'أحدث المستخدمين' : 'Recent Users'}
                            </h3>
                            {data.recentUsers.length === 0 ? (
                                <p className="text-xs text-text-light text-center py-4">{t.common.noResults}</p>
                            ) : (
                                <div className="space-y-2">
                                    {data.recentUsers.map((user) => (
                                        <div key={user.id} className="flex items-center gap-3 p-2.5 bg-bg-secondary rounded-lg">
                                            <div className="w-8 h-8 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center text-teal">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-text-primary truncate">{user.username || user.email?.split('@')[0]}</p>
                                                <p className="text-[10px] text-text-light truncate">{user.email}</p>
                                            </div>
                                            <span className="text-[10px] text-text-muted flex-shrink-0">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent feedback */}
                        <div className="bg-bg-card border border-border-light rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-text-primary mb-4">
                                {language === 'ar' ? 'أحدث الملاحظات' : 'Recent Feedback'}
                            </h3>
                            {data.recentFeedback.length === 0 ? (
                                <p className="text-xs text-text-light text-center py-4">{t.common.noResults}</p>
                            ) : (
                                <div className="space-y-2">
                                    {data.recentFeedback.map((fb) => (
                                        <div key={fb.id} className="p-2.5 bg-bg-secondary rounded-lg">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <p className="text-sm text-text-primary truncate">{fb.subject}</p>
                                                <Badge variant={feedbackStatusMap[fb.status] || 'default'}>
                                                    {fb.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-text-muted">
                                                <span>{fb.profiles?.username || '?'}</span>
                                                <span>•</span>
                                                <span>{fb.type}</span>
                                                {fb.rating && <span>⭐{fb.rating}</span>}
                                                <span className="ms-auto">{new Date(fb.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
