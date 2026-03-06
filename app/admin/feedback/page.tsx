'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';

interface FeedbackItem {
    id: string;
    subject: string;
    message: string;
    type: string;
    status: string;
    rating: number | null;
    priority: string | null;
    admin_response: string | null;
    created_at: string;
    profiles: { username: string; email: string } | null;
}

const statusOptions = ['pending', 'reviewed', 'resolved', 'dismissed'];
const priorityOptions = ['low', 'medium', 'high'];

const statusVariantMap: Record<string, 'warning' | 'default' | 'success' | 'error'> = {
    pending: 'warning',
    reviewed: 'default',
    resolved: 'success',
    dismissed: 'error',
};

export default function AdminFeedbackPage() {
    const { t, language } = useTranslation();
    const { isLoading: authLoading } = useAuth();
    const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [responseText, setResponseText] = useState('');
    const [updating, setUpdating] = useState<string | null>(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetch('/api/admin/feedback')
            .then((r) => r.json())
            .then((data) => { if (Array.isArray(data)) setFeedback(data); })
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, []);

    const updateFeedback = async (id: string, updates: Record<string, unknown>) => {
        setUpdating(id);
        try {
            const res = await fetch('/api/admin/feedback', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates }),
            });
            if (res.ok) {
                setFeedback((prev) => prev.map((f) => f.id === id ? { ...f, ...updates } as FeedbackItem : f));
            }
        } catch { /* ignore */ }
        setUpdating(null);
    };

    const filtered = feedback.filter((f) => filter === 'all' || f.status === filter);

    if (authLoading) return <LoadingSpinner fullScreen />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gradient-gold">
                        {language === 'ar' ? 'إدارة الملاحظات' : 'Feedback Management'}
                    </h1>
                    <p className="text-text-light text-sm mt-1">
                        {feedback.length} {language === 'ar' ? 'ملاحظة' : 'total feedback'}
                    </p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
                {['all', ...statusOptions].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${filter === s ? 'bg-teal/10 border-teal/50 text-teal' : 'border-border-light text-text-light hover:border-border'}`}
                    >
                        {s === 'all' ? t.common.all : s}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12"><LoadingSpinner /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-text-light">
                    <div className="text-4xl mb-3">📭</div>
                    <p>{t.common.noResults}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((item) => {
                        const isExpanded = expandedId === item.id;
                        return (
                            <div key={item.id} className="bg-bg-card shadow-sm border border-border-light rounded-xl overflow-hidden">
                                <button
                                    onClick={() => { setExpandedId(isExpanded ? null : item.id); setResponseText(item.admin_response || ''); }}
                                    className="w-full flex items-center justify-between p-4 text-start hover:bg-bg-card transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-text-primary truncate">{item.subject}</h3>
                                        <p className="text-[10px] text-text-light mt-0.5">
                                            {item.profiles?.username || item.profiles?.email || '?'} • {item.type}
                                            {item.rating ? ` • ⭐${item.rating}` : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Badge variant={statusVariantMap[item.status] || 'default'}>{item.status}</Badge>
                                        <span className={`text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▸</span>
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="border-t border-border-light p-4 space-y-4">
                                        <div className="bg-bg-secondary rounded-lg p-3">
                                            <p className="text-sm text-text-light leading-relaxed whitespace-pre-wrap">{item.message}</p>
                                        </div>

                                        {item.rating && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-text-light">{language === 'ar' ? 'التقييم:' : 'Rating:'}</span>
                                                <StarRating value={item.rating} readonly size="sm" />
                                            </div>
                                        )}

                                        <div className="flex gap-3 flex-wrap">
                                            <div>
                                                <label className="text-[10px] text-text-light block mb-1">{t.common.status}</label>
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => updateFeedback(item.id, { status: e.target.value })}
                                                    className="bg-bg-secondary border border-border-light rounded-lg px-2 py-1.5 text-xs text-text-primary outline-none"
                                                    disabled={updating === item.id}
                                                >
                                                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-text-light block mb-1">
                                                    {language === 'ar' ? 'الأولوية' : 'Priority'}
                                                </label>
                                                <select
                                                    value={item.priority || 'medium'}
                                                    onChange={(e) => updateFeedback(item.id, { priority: e.target.value })}
                                                    className="bg-bg-secondary border border-border-light rounded-lg px-2 py-1.5 text-xs text-text-primary outline-none"
                                                    disabled={updating === item.id}
                                                >
                                                    {priorityOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] text-text-light block mb-1">
                                                {language === 'ar' ? 'رد المشرف' : 'Admin Response'}
                                            </label>
                                            <div className="flex gap-2">
                                                <textarea
                                                    rows={2}
                                                    value={responseText}
                                                    onChange={(e) => setResponseText(e.target.value)}
                                                    placeholder={language === 'ar' ? 'اكتب ردك...' : 'Write your response...'}
                                                    className="flex-1 bg-bg-secondary border border-border-light rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:border-teal/40 resize-none"
                                                />
                                                <button
                                                    onClick={() => updateFeedback(item.id, { admin_response: responseText, status: 'resolved' })}
                                                    disabled={updating === item.id || !responseText.trim()}
                                                    className="text-xs bg-teal/10 text-teal px-4 rounded-lg hover:bg-teal/20 transition-colors disabled:opacity-50 self-end"
                                                >
                                                    {updating === item.id ? '...' : (language === 'ar' ? 'إرسال' : 'Send')}
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-[10px] text-text-muted">{new Date(item.created_at).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
