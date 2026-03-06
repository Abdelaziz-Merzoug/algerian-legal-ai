'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    admin_note: string | null;
    created_at: string;
}

const STATUS_COLORS: Record<string, 'default' | 'warning' | 'success' | 'info' | 'error'> = {
    new: 'warning',
    in_progress: 'info',
    resolved: 'success',
    spam: 'error',
};

export default function AdminContactPage() {
    const { language } = useTranslation();
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
    const [adminNote, setAdminNote] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page) });
            if (statusFilter !== 'all') params.set('status', statusFilter);
            const res = await fetch(`/api/admin/contact?${params}`);
            const data = await res.json();
            setMessages(data.messages || []);
            setTotal(data.total || 0);
        } finally { setLoading(false); }
    }, [statusFilter, page]);

    useEffect(() => { fetchMessages(); }, [fetchMessages]);

    const handleStatusChange = async (id: string, status: string) => {
        setActionLoading(id);
        await fetch('/api/admin/contact', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status }),
        });
        await fetchMessages();
        if (selectedMsg?.id === id) setSelectedMsg(prev => prev ? { ...prev, status } : null);
        setActionLoading(null);
    };

    const handleSaveNote = async () => {
        if (!selectedMsg) return;
        setActionLoading('note');
        await fetch('/api/admin/contact', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedMsg.id, admin_note: adminNote }),
        });
        setActionLoading(null);
        await fetchMessages();
        setSelectedMsg(prev => prev ? { ...prev, admin_note: adminNote } : null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm(language === 'ar' ? 'حذف هذه الرسالة؟' : 'Delete this message?')) return;
        setActionLoading(id);
        await fetch(`/api/admin/contact?id=${id}`, { method: 'DELETE' });
        setActionLoading(null);
        if (selectedMsg?.id === id) setSelectedMsg(null);
        await fetchMessages();
    };

    const openMessage = (msg: ContactMessage) => {
        setSelectedMsg(msg);
        setAdminNote(msg.admin_note || '');
        // Mark as in_progress if new
        if (msg.status === 'new') handleStatusChange(msg.id, 'in_progress');
    };

    const statuses = [
        { key: 'all', label_ar: 'الكل', label_en: 'All' },
        { key: 'new', label_ar: 'جديد', label_en: 'New' },
        { key: 'in_progress', label_ar: 'قيد المعالجة', label_en: 'In Progress' },
        { key: 'resolved', label_ar: 'محلول', label_en: 'Resolved' },
        { key: 'spam', label_ar: 'سبام', label_en: 'Spam' },
    ];

    if (loading && messages.length === 0) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        {language === 'ar' ? 'رسائل التواصل' : 'Contact Messages'}
                    </h1>
                    <p className="text-sm text-text-secondary mt-1">{total} {language === 'ar' ? 'رسالة' : 'messages'}</p>
                </div>
            </div>

            {/* Status filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {statuses.map(s => (
                    <button
                        key={s.key}
                        onClick={() => { setStatusFilter(s.key); setPage(1); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[40px] ${statusFilter === s.key
                            ? 'bg-teal text-white'
                            : 'bg-bg-card text-text-secondary hover:bg-bg-card-hover border border-border'
                            }`}
                    >
                        {language === 'ar' ? s.label_ar : s.label_en}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Messages list */}
                <div className="lg:col-span-2 space-y-2">
                    {loading ? (
                        <div className="flex justify-center py-8"><LoadingSpinner /></div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-12 text-text-muted">
                            {language === 'ar' ? 'لا توجد رسائل' : 'No messages'}
                        </div>
                    ) : (
                        messages.map(msg => (
                            <button
                                key={msg.id}
                                onClick={() => openMessage(msg)}
                                className={`w-full text-start p-4 rounded-xl border transition-all ${selectedMsg?.id === msg.id
                                    ? 'border-teal bg-teal-light'
                                    : 'border-border-light bg-white hover:border-teal/40 hover:bg-bg-secondary'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className="font-medium text-sm text-text-primary truncate">{msg.name}</p>
                                    <Badge variant={STATUS_COLORS[msg.status] || 'default'}>
                                        {language === 'ar' ? statuses.find(s => s.key === msg.status)?.label_ar : statuses.find(s => s.key === msg.status)?.label_en}
                                    </Badge>
                                </div>
                                <p className="text-xs text-text-secondary truncate">{msg.subject || msg.email}</p>
                                <p className="text-xs text-text-muted mt-1">
                                    {new Date(msg.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'en-US')}
                                </p>
                            </button>
                        ))
                    )}

                    {/* Pagination */}
                    {total > 20 && (
                        <div className="flex justify-center gap-2 pt-2">
                            <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                                {language === 'ar' ? 'السابق' : 'Previous'}
                            </Button>
                            <span className="text-sm text-text-muted py-2">{page}</span>
                            <Button variant="ghost" size="sm" onClick={() => setPage(p => p + 1)} disabled={messages.length < 20}>
                                {language === 'ar' ? 'التالي' : 'Next'}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Message detail panel */}
                <div className="lg:col-span-3">
                    {selectedMsg ? (
                        <div className="bg-white border border-border-light rounded-xl p-6 space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="font-bold text-text-primary">{selectedMsg.name}</h2>
                                    <a href={`mailto:${selectedMsg.email}`} className="text-sm text-teal hover:underline">{selectedMsg.email}</a>
                                </div>
                                <Badge variant={STATUS_COLORS[selectedMsg.status] || 'default'}>
                                    {language === 'ar' ? statuses.find(s => s.key === selectedMsg.status)?.label_ar : statuses.find(s => s.key === selectedMsg.status)?.label_en}
                                </Badge>
                            </div>

                            {selectedMsg.subject && (
                                <div>
                                    <p className="text-xs font-semibold text-text-muted uppercase mb-1">{language === 'ar' ? 'الموضوع' : 'Subject'}</p>
                                    <p className="text-sm font-medium text-text-primary">{selectedMsg.subject}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-xs font-semibold text-text-muted uppercase mb-2">{language === 'ar' ? 'الرسالة' : 'Message'}</p>
                                <div className="bg-bg-secondary rounded-lg p-4 text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                                    {selectedMsg.message}
                                </div>
                            </div>

                            {/* Admin note */}
                            <div>
                                <p className="text-xs font-semibold text-text-muted uppercase mb-2">{language === 'ar' ? 'ملاحظة المدير' : 'Admin Note'}</p>
                                <textarea
                                    value={adminNote}
                                    onChange={e => setAdminNote(e.target.value)}
                                    placeholder={language === 'ar' ? 'أضف ملاحظة...' : 'Add a note...'}
                                    className="w-full px-4 py-3 bg-bg-card border border-border rounded-xl text-sm text-text-primary min-h-[80px] resize-none focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
                                />
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <Button size="sm" onClick={handleSaveNote} isLoading={actionLoading === 'note'}>
                                    {language === 'ar' ? 'حفظ الملاحظة' : 'Save Note'}
                                </Button>
                                {selectedMsg.status !== 'resolved' && (
                                    <Button variant="secondary" size="sm" onClick={() => handleStatusChange(selectedMsg.id, 'resolved')} isLoading={actionLoading === selectedMsg.id}>
                                        {language === 'ar' ? 'تحديد كمحلول' : 'Mark Resolved'}
                                    </Button>
                                )}
                                {selectedMsg.status !== 'spam' && (
                                    <Button variant="ghost" size="sm" onClick={() => handleStatusChange(selectedMsg.id, 'spam')} isLoading={actionLoading === selectedMsg.id}>
                                        {language === 'ar' ? 'تحديد كسبام' : 'Mark Spam'}
                                    </Button>
                                )}
                                <Button variant="danger" size="sm" onClick={() => handleDelete(selectedMsg.id)} isLoading={actionLoading === selectedMsg.id}>
                                    {language === 'ar' ? 'حذف' : 'Delete'}
                                </Button>
                            </div>

                            <p className="text-xs text-text-muted">
                                {new Date(selectedMsg.created_at).toLocaleString(language === 'ar' ? 'ar-DZ' : 'en-US')}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-bg-secondary border border-border-light rounded-xl flex items-center justify-center h-64">
                            <p className="text-text-muted text-sm">
                                {language === 'ar' ? 'اختر رسالة لعرض تفاصيلها' : 'Select a message to view details'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
