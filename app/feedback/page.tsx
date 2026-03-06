'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/useTranslation';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';

interface FeedbackItem {
    id: string;
    subject: string;
    message: string;
    type: string;
    status: string;
    rating: number | null;
    admin_response: string | null;
    created_at: string;
}

export default function FeedbackPage() {
    const { t, language } = useTranslation();
    const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
    const [form, setForm] = useState({ subject: '', message: '', type: 'general', rating: 0 });
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [history, setHistory] = useState<FeedbackItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const feedbackTypes = [
        { value: 'suggestion', label: language === 'ar' ? 'اقتراح' : 'Suggestion' },
        { value: 'complaint', label: language === 'ar' ? 'شكوى' : 'Complaint' },
        { value: 'bug', label: language === 'ar' ? 'خطأ تقني' : 'Bug Report' },
        { value: 'rating', label: language === 'ar' ? 'تقييم' : 'Rating' },
        { value: 'general', label: language === 'ar' ? 'عام' : 'General' },
        { value: 'other', label: language === 'ar' ? 'أخرى' : 'Other' },
    ];

    const statusMap: Record<string, { label: string; variant: 'default' | 'warning' | 'success' | 'error' }> = {
        pending: { label: language === 'ar' ? 'جديد' : 'New', variant: 'warning' },
        reviewed: { label: language === 'ar' ? 'قيد المراجعة' : 'Reviewing', variant: 'default' },
        resolved: { label: language === 'ar' ? 'تم الرد' : 'Responded', variant: 'success' },
        dismissed: { label: language === 'ar' ? 'مغلق' : 'Closed', variant: 'error' },
    };

    const loadHistory = async () => {
        setLoadingHistory(true);
        try {
            const res = await fetch('/api/feedback');
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch { /* ignore */ }
        setLoadingHistory(false);
    };

    useEffect(() => {
        if (activeTab === 'history') loadHistory();
    }, [activeTab]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setSent(true);
                setForm({ subject: '', message: '', type: 'general', rating: 0 });
            }
        } catch { /* ignore */ }
        setIsSending(false);
    };

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar />
            <main className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">📝</div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-3">{t.feedback.title}</h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-bg-card rounded-xl p-1 mb-8">
                    <button
                        onClick={() => setActiveTab('form')}
                        className={`flex-1 py-2.5 text-sm rounded-lg transition-all font-medium ${activeTab === 'form' ? 'bg-teal text-navy' : 'text-text-light hover:text-teal'}`}
                    >
                        {t.profile.sendFeedback}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-2.5 text-sm rounded-lg transition-all font-medium ${activeTab === 'history' ? 'bg-teal text-navy' : 'text-text-light hover:text-teal'}`}
                    >
                        {language === 'ar' ? 'ملاحظاتي السابقة' : 'My Feedback History'}
                    </button>
                </div>

                {activeTab === 'form' ? (
                    sent ? (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
                            <div className="text-4xl mb-3">✅</div>
                            <p className="text-green-300 font-medium">{t.feedback.submitSuccess}</p>
                            <button onClick={() => setSent(false)} className="mt-4 text-sm text-teal hover:text-teal transition-colors">
                                {language === 'ar' ? 'إرسال ملاحظة أخرى' : 'Send Another'}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Type */}
                            <div>
                                <label className="text-sm text-text-light block mb-2">{t.profile.feedbackType}</label>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {feedbackTypes.map((ft) => (
                                        <button
                                            key={ft.value}
                                            type="button"
                                            onClick={() => setForm({ ...form, type: ft.value })}
                                            className={`text-xs px-3 py-2 rounded-lg border transition-all ${form.type === ft.value ? 'bg-teal/10 border-teal/50 text-teal' : 'border-border-light text-text-light hover:border-border'}`}
                                        >
                                            {ft.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="text-sm text-text-light block mb-2">
                                    {language === 'ar' ? 'تقييم المنصة' : 'Platform Rating'} ({t.common.optional})
                                </label>
                                <StarRating value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
                            </div>

                            {/* Subject */}
                            <input
                                type="text"
                                required
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                placeholder={t.profile.feedbackSubjectPlaceholder}
                                className="w-full bg-bg-card shadow-sm border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-teal/40 transition-colors"
                            />

                            {/* Message */}
                            <textarea
                                required
                                rows={5}
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                placeholder={t.profile.feedbackMessagePlaceholder}
                                className="w-full bg-bg-card shadow-sm border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-teal/40 transition-colors resize-none"
                            />

                            <button
                                type="submit"
                                disabled={isSending}
                                className="bg-teal hover:bg-teal-light text-navy font-bold px-8 py-3 rounded-xl transition-colors text-sm disabled:opacity-50"
                            >
                                {isSending ? t.common.loading : t.common.submit}
                            </button>
                        </form>
                    )
                ) : (
                    /* History tab */
                    <div>
                        {loadingHistory ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-bg-card border border-border rounded-xl p-4 animate-pulse h-20" />
                                ))}
                            </div>
                        ) : history.length === 0 ? (
                            <div className="text-center py-16 text-text-light">
                                <div className="text-4xl mb-3">📭</div>
                                <p>{language === 'ar' ? 'لم ترسل أي ملاحظات بعد' : 'No feedback submitted yet'}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {history.map((item) => (
                                    <div key={item.id} className="bg-bg-card shadow-sm border border-border-light rounded-xl p-5">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <h3 className="text-sm font-semibold text-text-primary">{item.subject}</h3>
                                            <Badge variant={statusMap[item.status]?.variant || 'default'}>
                                                {statusMap[item.status]?.label || item.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-text-light mb-2 line-clamp-2">{item.message}</p>
                                        <div className="flex items-center gap-3 text-[10px] text-text-muted">
                                            <span>{feedbackTypes.find((ft) => ft.value === item.type)?.label || item.type}</span>
                                            {item.rating && <StarRating value={item.rating} readonly size="sm" />}
                                            <span>{new Date(item.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'en-US')}</span>
                                        </div>
                                        {item.admin_response && (
                                            <div className="mt-3 bg-teal/5 border-s-2 border-teal/40 rounded-e-lg p-3">
                                                <p className="text-xs text-text-muted mb-1">{t.admin.adminResponse}:</p>
                                                <p className="text-xs text-text-light">{item.admin_response}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
