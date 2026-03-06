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
                            { label: language === 'ar' ? 'مستخدمين' : 'Users', value: data.totals.users, icon: '👥' },
                            { label: language === 'ar' ? 'نصوص' : 'Docs', value: data.totals.documents, icon: '📚' },
                            { label: language === 'ar' ? 'مواد' : 'Articles', value: data.totals.articles, icon: '📋' },
                            { label: language === 'ar' ? 'محادثات' : 'Chats', value: data.totals.conversations, icon: '💬' },
                            { label: language === 'ar' ? 'رسائل' : 'Messages', value: data.totals.messages, icon: '📨' },
                            { label: language === 'ar' ? 'ملاحظات' : 'Feedback', value: data.totals.feedback, icon: '📝' },
                            { label: language === 'ar' ? 'رسائل تواصل' : 'Contacts', value: data.totals.contacts, icon: '📬' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-bg-card border border-border-light rounded-xl p-4 text-center">
                                <div className="text-xl mb-1">{stat.icon}</div>
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
                                            <div className="w-8 h-8 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center text-sm">
                                                👤
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
