'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

interface AdminStats {
    totalUsers: number;
    totalDocuments: number;
    totalArticles: number;
    totalConversations: number;
    totalMessages: number;
    totalFeedback: number;
    pendingFeedback: number;
    activeCategories: number;
}

interface AuditEntry {
    id: string;
    action: string;
    target_type: string;
    target_id: string | null;
    details: Record<string, unknown> | null;
    created_at: string;
    admin?: { username: string };
}

const ACTION_ICONS: Record<string, string> = {
    invite_user: '➕',
    delete_user: '🗑️',
    activate_user: '✅',
    deactivate_user: '🚫',
    bulk_delete_users: '🗑️',
    bulk_activate_users: '✅',
    bulk_deactivate_users: '🚫',
    reset_password: '🔑',
    edit_user: '✏️',
    import_laws: '📥',
    delete_law: '🗑️',
    edit_law: '✏️',
    bulk_delete_laws: '🗑️',
    bulk_status_change_laws: '🔄',
    change_law_status: '🔄',
    update_contact_message: '✉️',
    default: '⚡',
};

function formatAction(action: string, language: string): string {
    const map: Record<string, { ar: string; en: string }> = {
        invite_user: { ar: 'دعوة مستخدم', en: 'Invited user' },
        delete_user: { ar: 'حذف مستخدم', en: 'Deleted user' },
        activate_user: { ar: 'تفعيل مستخدم', en: 'Activated user' },
        deactivate_user: { ar: 'تعطيل مستخدم', en: 'Deactivated user' },
        bulk_delete_users: { ar: 'حذف مجموعة مستخدمين', en: 'Bulk deleted users' },
        bulk_activate_users: { ar: 'تفعيل مجموعة مستخدمين', en: 'Bulk activated users' },
        bulk_deactivate_users: { ar: 'تعطيل مجموعة مستخدمين', en: 'Bulk deactivated users' },
        reset_password: { ar: 'إعادة تعيين كلمة المرور', en: 'Reset password' },
        edit_user: { ar: 'تعديل مستخدم', en: 'Edited user' },
        import_laws: { ar: 'استيراد قوانين', en: 'Imported laws' },
        delete_law: { ar: 'حذف قانون', en: 'Deleted law' },
        edit_law: { ar: 'تعديل قانون', en: 'Edited law' },
        bulk_delete_laws: { ar: 'حذف مجموعة قوانين', en: 'Bulk deleted laws' },
        bulk_status_change_laws: { ar: 'تغيير حالة قوانين', en: 'Changed law statuses' },
        change_law_status: { ar: 'تغيير حالة قانون', en: 'Changed law status' },
        update_contact_message: { ar: 'تحديث رسالة تواصل', en: 'Updated contact message' },
    };
    const found = map[action];
    return found ? (language === 'ar' ? found.ar : found.en) : action.replace(/_/g, ' ');
}

export default function AdminDashboardPage() {
    const { t, language } = useTranslation();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [statsRes, auditRes] = await Promise.all([
                    fetch('/api/admin/stats'),
                    fetch('/api/admin/audit-log'),
                ]);
                if (statsRes.ok) setStats(await statsRes.json());
                if (auditRes.ok) {
                    const data = await auditRes.json();
                    setAuditLog(data.entries || []);
                }
            } catch { /* empty */ }
            finally { setIsLoading(false); }
        };
        fetchAll();
    }, []);

    if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

    const statCards = [
        { icon: '👥', value: stats?.totalUsers || 0, label: t.admin.totalUsers, href: '/admin/users', color: 'bg-blue-50 text-blue-600' },
        { icon: '📚', value: stats?.totalDocuments || 0, label: t.admin.totalDocuments, href: '/admin/laws', color: 'bg-green-50 text-green-600' },
        { icon: '📜', value: stats?.totalArticles || 0, label: t.admin.totalArticles, href: '/admin/laws', color: 'bg-purple-50 text-purple-600' },
        { icon: '💬', value: stats?.totalConversations || 0, label: t.admin.totalConversations, href: null, color: 'bg-cyan-50 text-cyan-600' },
        { icon: '✉️', value: stats?.totalMessages || 0, label: t.admin.totalMessages, href: null, color: 'bg-pink-50 text-pink-600' },
        { icon: '📋', value: stats?.totalFeedback || 0, label: t.admin.totalFeedback, href: '/admin/feedback', color: 'bg-orange-50 text-orange-600' },
        { icon: '⏳', value: stats?.pendingFeedback || 0, label: t.admin.pendingFeedback, href: '/admin/feedback', color: 'bg-amber-50 text-amber-600' },
        { icon: '📁', value: stats?.activeCategories || 0, label: t.admin.activeCategories, href: '/admin/categories', color: 'bg-teal-50 text-teal' },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-text-primary">{t.admin.dashboard}</h1>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, idx) => {
                    const content = (
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-3xl font-black text-text-primary">{card.value.toLocaleString()}</p>
                                <p className="text-xs text-text-secondary mt-1">{card.label}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${card.color}`}>
                                {card.icon}
                            </div>
                        </div>
                    );

                    return card.href ? (
                        <Link key={idx} href={card.href}>
                            <Card padding="md" hover>{content}</Card>
                        </Link>
                    ) : (
                        <Card key={idx} padding="md">{content}</Card>
                    );
                })}
            </div>

            {/* Quick links + Activity feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick links */}
                <div className="lg:col-span-1">
                    <h2 className="text-base font-semibold text-text-primary mb-3">
                        {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
                    </h2>
                    <div className="space-y-2">
                        {[
                            { href: '/admin/users', icon: '👥', label_ar: 'إدارة المستخدمين', label_en: 'Manage Users' },
                            { href: '/admin/laws', icon: '📚', label_ar: 'إدارة القوانين', label_en: 'Manage Laws' },
                            { href: '/admin/categories', icon: '📁', label_ar: 'إدارة التصنيفات', label_en: 'Manage Categories' },
                            { href: '/admin/contact', icon: '✉️', label_ar: 'رسائل التواصل', label_en: 'Contact Messages' },
                            { href: '/admin/feedback', icon: '💬', label_ar: 'التقييمات', label_en: 'Feedback' },
                            { href: '/admin/analytics', icon: '📈', label_ar: 'التحليلات', label_en: 'Analytics' },
                        ].map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 px-4 py-3 bg-white border border-border-light rounded-xl hover:border-teal/40 hover:bg-teal-light transition-all text-sm text-text-primary"
                            >
                                <span>{link.icon}</span>
                                <span>{language === 'ar' ? link.label_ar : link.label_en}</span>
                                <span className="ms-auto text-text-muted">→</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Activity feed */}
                <div className="lg:col-span-2">
                    <h2 className="text-base font-semibold text-text-primary mb-3">
                        {language === 'ar' ? 'سجل الأنشطة' : 'Activity Feed'}
                    </h2>
                    <div className="bg-white border border-border-light rounded-xl overflow-hidden">
                        {auditLog.length === 0 ? (
                            <div className="text-center py-12 text-text-muted text-sm">
                                {language === 'ar' ? 'لا يوجد نشاط حتى الآن' : 'No activity yet'}
                            </div>
                        ) : (
                            <div className="divide-y divide-border-light max-h-[400px] overflow-y-auto custom-scrollbar">
                                {auditLog.map((entry) => (
                                    <div key={entry.id} className="flex items-start gap-3 px-4 py-3">
                                        <div className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-sm shrink-0">
                                            {ACTION_ICONS[entry.action] || ACTION_ICONS.default}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-text-primary">
                                                {formatAction(entry.action, language)}
                                            </p>
                                            {entry.details && Object.keys(entry.details).length > 0 && (
                                                <p className="text-xs text-text-muted mt-0.5">
                                                    {Object.entries(entry.details)
                                                        .filter(([k]) => !['ids'].includes(k))
                                                        .map(([k, v]) => `${k}: ${v}`)
                                                        .join(', ')
                                                        .slice(0, 80)}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-xs text-text-muted shrink-0">
                                            {new Date(entry.created_at).toLocaleString(language === 'ar' ? 'ar-DZ' : 'en-US', {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
