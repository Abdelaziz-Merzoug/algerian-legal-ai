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

// SVG icon components for admin dashboard
function PlusIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>; }
function TrashSvg() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>; }
function CheckSvg() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>; }
function BanSvg() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth={1.5} /><path strokeLinecap="round" strokeWidth={1.5} d="M6 6l12 12" /></svg>; }
function KeySvg() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>; }
function EditSvg() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>; }
function ImportSvg() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>; }
function RefreshSvg() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>; }
function MailSvg() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>; }
function ZapSvg() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>; }
// Stat card icons
function UsersStatSvg() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }
function BookStatSvg() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>; }
function ScrollStatSvg() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>; }
function ChatStatSvg() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>; }
function MailStatSvg() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>; }
function ClipboardStatSvg() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>; }
function ClockStatSvg() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function FolderStatSvg() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>; }
// Quick-link icons
function ArrowRightSvg() { return <svg className="w-4 h-4 ms-auto text-text-muted rtl:rotate-180 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>; }
function ChartNavSvg() { return <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>; }

type ActionIconComponent = () => React.JSX.Element;
const ACTION_ICON_COMPONENTS: Record<string, ActionIconComponent> = {
    invite_user: PlusIcon,
    delete_user: TrashSvg,
    activate_user: CheckSvg,
    deactivate_user: BanSvg,
    bulk_delete_users: TrashSvg,
    bulk_activate_users: CheckSvg,
    bulk_deactivate_users: BanSvg,
    reset_password: KeySvg,
    edit_user: EditSvg,
    import_laws: ImportSvg,
    delete_law: TrashSvg,
    edit_law: EditSvg,
    bulk_delete_laws: TrashSvg,
    bulk_status_change_laws: RefreshSvg,
    change_law_status: RefreshSvg,
    update_contact_message: MailSvg,
    default: ZapSvg,
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
        { Icon: UsersStatSvg, value: stats?.totalUsers || 0, label: t.admin.totalUsers, href: '/admin/users', color: 'bg-blue-50 text-blue-600' },
        { Icon: BookStatSvg, value: stats?.totalDocuments || 0, label: t.admin.totalDocuments, href: '/admin/laws', color: 'bg-green-50 text-green-600' },
        { Icon: ScrollStatSvg, value: stats?.totalArticles || 0, label: t.admin.totalArticles, href: '/admin/laws', color: 'bg-purple-50 text-purple-600' },
        { Icon: ChatStatSvg, value: stats?.totalConversations || 0, label: t.admin.totalConversations, href: null, color: 'bg-cyan-50 text-cyan-600' },
        { Icon: MailStatSvg, value: stats?.totalMessages || 0, label: t.admin.totalMessages, href: null, color: 'bg-pink-50 text-pink-600' },
        { Icon: ClipboardStatSvg, value: stats?.totalFeedback || 0, label: t.admin.totalFeedback, href: '/admin/feedback', color: 'bg-orange-50 text-orange-600' },
        { Icon: ClockStatSvg, value: stats?.pendingFeedback || 0, label: t.admin.pendingFeedback, href: '/admin/feedback', color: 'bg-amber-50 text-amber-600' },
        { Icon: FolderStatSvg, value: stats?.activeCategories || 0, label: t.admin.activeCategories, href: '/admin/categories', color: 'bg-teal-50 text-teal' },
    ];

    const quickLinks = [
        { href: '/admin/users', Icon: UsersStatSvg, label_ar: 'إدارة المستخدمين', label_en: 'Manage Users' },
        { href: '/admin/laws', Icon: BookStatSvg, label_ar: 'إدارة القوانين', label_en: 'Manage Laws' },
        { href: '/admin/categories', Icon: FolderStatSvg, label_ar: 'إدارة التصنيفات', label_en: 'Manage Categories' },
        { href: '/admin/contact', Icon: MailStatSvg, label_ar: 'رسائل التواصل', label_en: 'Contact Messages' },
        { href: '/admin/feedback', Icon: ChatStatSvg, label_ar: 'التقييمات', label_en: 'Feedback' },
        { href: '/admin/analytics', Icon: ChartNavSvg, label_ar: 'التحليلات', label_en: 'Analytics' },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-text-primary">{t.admin.dashboard}</h1>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(({ Icon, value, label, href, color }, idx) => {
                    const content = (
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-3xl font-black text-text-primary">{value.toLocaleString()}</p>
                                <p className="text-xs text-text-secondary mt-1">{label}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                                <Icon />
                            </div>
                        </div>
                    );

                    return href ? (
                        <Link key={idx} href={href}>
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
                        {quickLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 px-4 py-3 bg-white border border-border-light rounded-xl hover:border-teal/40 hover:bg-teal-light transition-all text-sm text-text-primary"
                            >
                                <span className="text-teal shrink-0"><link.Icon /></span>
                                <span>{language === 'ar' ? link.label_ar : link.label_en}</span>
                                <ArrowRightSvg />
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
                                {auditLog.map((entry) => {
                                    const ActionIconComp = ACTION_ICON_COMPONENTS[entry.action] || ACTION_ICON_COMPONENTS.default;
                                    return (
                                        <div key={entry.id} className="flex items-start gap-3 px-4 py-3">
                                            <div className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-text-secondary shrink-0">
                                                <ActionIconComp />
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
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

