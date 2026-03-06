'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { PlusIcon, SearchIcon, EyeIcon, CheckIcon, XIcon, LockIcon, TrashIcon } from '@/components/ui/Icon';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
    last_active: string | null;
}

interface UserDetails {
    profile: User;
    stats: { conversations: number; messages: number; feedback: number };
    recentConversations: { id: string; title: string; created_at: string }[];
}

export default function AdminUsersPage() {
    const { t, language } = useTranslation();
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Modals
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteUsername, setInviteUsername] = useState('');
    const [inviteResult, setInviteResult] = useState<{ email: string; tempPassword: string } | null>(null);

    const [detailsUser, setDetailsUser] = useState<UserDetails | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const [actionMenuId, setActionMenuId] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            setUsers(data.users || data || []);
        } catch { /* empty */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    // Filtered users
    const filteredUsers = users.filter(u => {
        const matchesSearch = !searchQuery ||
            u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && u.is_active) ||
            (statusFilter === 'inactive' && !u.is_active);
        return matchesSearch && matchesStatus;
    });

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredUsers.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(filteredUsers.map(u => u.id)));
    };

    // Actions
    const handleToggle = async (id: string) => {
        setActionLoading(id);
        await fetch(`/api/admin/users/${id}/toggle`, { method: 'POST' });
        await fetchUsers();
        setActionLoading(null);
        setActionMenuId(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المستخدم؟ سيتم حذف جميع بياناته.' : 'Are you sure you want to delete this user? All their data will be deleted.')) return;
        setActionLoading(id);
        await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        await fetchUsers();
        setActionLoading(null);
        setActionMenuId(null);
    };

    const handleReset = async (id: string) => {
        setActionLoading(id);
        const res = await fetch(`/api/admin/users/${id}/reset`, { method: 'POST' });
        const data = await res.json();
        if (data.success) {
            alert(language === 'ar' ? `تم إرسال رابط إعادة التعيين إلى ${data.email}` : `Password reset link sent to ${data.email}`);
        }
        setActionLoading(null);
        setActionMenuId(null);
    };

    const handleViewDetails = async (id: string) => {
        setActionLoading(id);
        const res = await fetch(`/api/admin/users/${id}/details`);
        const data = await res.json();
        setDetailsUser(data);
        setDetailsOpen(true);
        setActionLoading(null);
        setActionMenuId(null);
    };

    const handleInvite = async () => {
        if (!inviteEmail) return;
        setActionLoading('invite');
        const res = await fetch('/api/admin/users/invite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: inviteEmail, username: inviteUsername }),
        });
        const data = await res.json();
        if (data.success) {
            setInviteResult({ email: inviteEmail, tempPassword: data.tempPassword });
            await fetchUsers();
        } else {
            alert(data.error);
        }
        setActionLoading(null);
    };

    const handleBulkDelete = async () => {
        if (!confirm(language === 'ar' ? `حذف ${selectedIds.size} مستخدم؟` : `Delete ${selectedIds.size} users?`)) return;
        setActionLoading('bulk');
        await fetch('/api/admin/users/bulk', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: Array.from(selectedIds) }),
        });
        setSelectedIds(new Set());
        await fetchUsers();
        setActionLoading(null);
    };

    const handleBulkDeactivate = async () => {
        setActionLoading('bulk');
        await fetch('/api/admin/users/bulk', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: Array.from(selectedIds), is_active: false }),
        });
        setSelectedIds(new Set());
        await fetchUsers();
        setActionLoading(null);
    };

    if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">{t.admin.users}</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        {filteredUsers.length} {language === 'ar' ? 'مستخدم' : 'users'}
                    </p>
                </div>
                <Button variant="primary" onClick={() => { setInviteOpen(true); setInviteResult(null); setInviteEmail(''); setInviteUsername(''); }}>
                    <PlusIcon className="w-4 h-4 inline me-1.5" />
                    {language === 'ar' ? 'دعوة مستخدم' : 'Invite User'}
                </Button>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <Input
                        placeholder={language === 'ar' ? 'بحث بالاسم أو البريد...' : 'Search by name or email...'}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        icon={<SearchIcon className="w-4 h-4" />}
                    />
                </div>
                <div className="flex gap-2">
                    {(['all', 'active', 'inactive'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${statusFilter === s
                                ? 'bg-teal text-white'
                                : 'bg-bg-card text-text-secondary hover:bg-bg-card-hover border border-border'
                                }`}
                        >
                            {s === 'all' ? (language === 'ar' ? 'الكل' : 'All') :
                                s === 'active' ? (language === 'ar' ? 'نشط' : 'Active') :
                                    (language === 'ar' ? 'معطل' : 'Inactive')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bulk actions bar */}
            {selectedIds.size > 0 && (
                <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                    <span className="text-sm font-medium text-primary">
                        {selectedIds.size} {language === 'ar' ? 'محدد' : 'selected'}
                    </span>
                    <Button variant="danger" size="sm" onClick={handleBulkDelete} isLoading={actionLoading === 'bulk'}>
                        {language === 'ar' ? 'حذف المحدد' : 'Delete Selected'}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleBulkDeactivate} isLoading={actionLoading === 'bulk'}>
                        {language === 'ar' ? 'تعطيل المحدد' : 'Deactivate Selected'}
                    </Button>
                </div>
            )}

            {/* Users table */}
            <div className="bg-white border border-border-light rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border-light bg-bg-secondary">
                                <th className="px-4 py-3 text-start">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.size === filteredUsers.length && filteredUsers.length > 0}
                                        onChange={toggleSelectAll}
                                        className="rounded border-border"
                                    />
                                </th>
                                <th className="px-4 py-3 text-start text-xs font-semibold text-text-secondary uppercase">{language === 'ar' ? 'المستخدم' : 'User'}</th>
                                <th className="px-4 py-3 text-start text-xs font-semibold text-text-secondary uppercase">{language === 'ar' ? 'البريد' : 'Email'}</th>
                                <th className="px-4 py-3 text-start text-xs font-semibold text-text-secondary uppercase">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                                <th className="px-4 py-3 text-start text-xs font-semibold text-text-secondary uppercase">{language === 'ar' ? 'الدور' : 'Role'}</th>
                                <th className="px-4 py-3 text-start text-xs font-semibold text-text-secondary uppercase">{language === 'ar' ? 'التسجيل' : 'Joined'}</th>
                                <th className="px-4 py-3 text-start text-xs font-semibold text-text-secondary uppercase">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-bg-secondary transition-colors">
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(u.id)}
                                            onChange={() => toggleSelect(u.id)}
                                            className="rounded border-border"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                                {u.username?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <span className="text-sm font-medium text-text-primary">{u.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-text-secondary">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={u.is_active ? 'success' : 'error'}>
                                            {u.is_active ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'معطل' : 'Inactive')}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={u.role === 'admin' ? 'gold' : 'default'}>
                                            {u.role === 'admin' ? (language === 'ar' ? 'مدير' : 'Admin') : (language === 'ar' ? 'مستخدم' : 'User')}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-text-muted">
                                        {new Date(u.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'en-US')}
                                    </td>
                                    <td className="px-4 py-3 relative">
                                        <button
                                            onClick={() => setActionMenuId(actionMenuId === u.id ? null : u.id)}
                                            className="p-2 rounded-lg hover:bg-bg-card text-text-secondary transition-colors"
                                            disabled={actionLoading === u.id}
                                        >
                                            {actionLoading === u.id ? <LoadingSpinner /> : '⋮'}
                                        </button>

                                        {/* Actions dropdown */}
                                        {actionMenuId === u.id && (
                                            <div className="absolute end-4 top-full mt-1 z-20 bg-white border border-border rounded-xl shadow-lg py-1 min-w-[180px]">
                                                <button onClick={() => handleViewDetails(u.id)} className="w-full text-start px-4 py-2 text-sm hover:bg-bg-secondary transition-colors flex items-center gap-2">
                                                    <EyeIcon className="w-4 h-4 text-text-muted" /> {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                                                </button>
                                                <button onClick={() => handleToggle(u.id)} className="w-full text-start px-4 py-2 text-sm hover:bg-bg-secondary transition-colors flex items-center gap-2">
                                                    {u.is_active
                                                        ? <XIcon className="w-4 h-4 text-error" />
                                                        : <CheckIcon className="w-4 h-4 text-success" />}
                                                    {u.is_active ? (language === 'ar' ? 'تعطيل' : 'Deactivate') : (language === 'ar' ? 'تفعيل' : 'Activate')}
                                                </button>
                                                <button onClick={() => handleReset(u.id)} className="w-full text-start px-4 py-2 text-sm hover:bg-bg-secondary transition-colors flex items-center gap-2">
                                                    <LockIcon className="w-4 h-4 text-text-muted" /> {language === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
                                                </button>
                                                <div className="border-t border-border-light my-1" />
                                                {u.id !== user?.id && (
                                                    <button onClick={() => handleDelete(u.id)} className="w-full text-start px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors flex items-center gap-2">
                                                        <TrashIcon className="w-4 h-4" /> {language === 'ar' ? 'حذف المستخدم' : 'Delete User'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-text-muted">
                        {language === 'ar' ? 'لا يوجد مستخدمون' : 'No users found'}
                    </div>
                )}
            </div>

            {/* Close action menu on outside click */}
            {actionMenuId && (
                <div className="fixed inset-0 z-10" onClick={() => setActionMenuId(null)} />
            )}

            {/* Invite Modal */}
            {inviteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-text-primary">
                                {language === 'ar' ? 'دعوة مستخدم جديد' : 'Invite New User'}
                            </h2>
                            <button onClick={() => setInviteOpen(false)} className="text-text-muted hover:text-text-primary p-1">✕</button>
                        </div>

                        {inviteResult ? (
                            <div className="space-y-3">
                                <div className="p-4 bg-success/10 border border-success/20 rounded-xl text-sm">
                                    <p className="font-semibold text-success mb-2 flex items-center gap-1.5">
                                        <CheckIcon className="w-4 h-4" /> {language === 'ar' ? 'تم إنشاء المستخدم' : 'User Created!'}
                                    </p>
                                    <p><strong>{language === 'ar' ? 'البريد:' : 'Email:'}</strong> {inviteResult.email}</p>
                                    <p><strong>{language === 'ar' ? 'كلمة المرور المؤقتة:' : 'Temp Password:'}</strong></p>
                                    <code className="block mt-1 p-2 bg-bg-card rounded text-primary font-mono text-sm">{inviteResult.tempPassword}</code>
                                </div>
                                <Button variant="primary" fullWidth onClick={() => setInviteOpen(false)}>
                                    {language === 'ar' ? 'إغلاق' : 'Close'}
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Input
                                    label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                                    type="email"
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    placeholder="user@example.com"
                                />
                                <Input
                                    label={language === 'ar' ? 'اسم المستخدم (اختياري)' : 'Username (optional)'}
                                    value={inviteUsername}
                                    onChange={e => setInviteUsername(e.target.value)}
                                    placeholder={language === 'ar' ? 'اسم المستخدم' : 'username'}
                                />
                                <div className="flex gap-3 pt-2">
                                    <Button variant="ghost" fullWidth onClick={() => setInviteOpen(false)}>
                                        {t.common.cancel}
                                    </Button>
                                    <Button variant="primary" fullWidth onClick={handleInvite} isLoading={actionLoading === 'invite'}>
                                        {language === 'ar' ? 'إرسال الدعوة' : 'Send Invite'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {detailsOpen && detailsUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-text-primary">
                                {language === 'ar' ? 'تفاصيل المستخدم' : 'User Details'}
                            </h2>
                            <button onClick={() => setDetailsOpen(false)} className="text-text-muted hover:text-text-primary p-1">✕</button>
                        </div>

                        {/* User info */}
                        <div className="flex items-center gap-4 p-4 bg-bg-secondary rounded-xl">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                {detailsUser.profile.username?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                                <p className="font-semibold text-text-primary">{detailsUser.profile.username}</p>
                                <p className="text-sm text-text-secondary">{detailsUser.profile.email}</p>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant={detailsUser.profile.is_active ? 'success' : 'error'}>
                                        {detailsUser.profile.is_active ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'معطل' : 'Inactive')}
                                    </Badge>
                                    <Badge variant={detailsUser.profile.role === 'admin' ? 'gold' : 'default'}>
                                        {detailsUser.profile.role}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: language === 'ar' ? 'محادثات' : 'Conversations', value: detailsUser.stats.conversations },
                                { label: language === 'ar' ? 'رسائل' : 'Messages', value: detailsUser.stats.messages },
                                { label: language === 'ar' ? 'ملاحظات' : 'Feedback', value: detailsUser.stats.feedback },
                            ].map(stat => (
                                <div key={stat.label} className="text-center p-3 bg-bg-card rounded-xl">
                                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                                    <p className="text-xs text-text-muted">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recent conversations */}
                        {detailsUser.recentConversations.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-text-primary mb-2">
                                    {language === 'ar' ? 'آخر المحادثات' : 'Recent Conversations'}
                                </h3>
                                <div className="space-y-1.5">
                                    {detailsUser.recentConversations.map(conv => (
                                        <div key={conv.id} className="flex items-center justify-between px-3 py-2 bg-bg-secondary rounded-lg text-sm">
                                            <span className="text-text-primary truncate">{conv.title}</span>
                                            <span className="text-xs text-text-muted shrink-0 ms-2">
                                                {new Date(conv.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'en-US')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-text-muted pt-2">
                            <span>{language === 'ar' ? 'عضو منذ:' : 'Member since:'}</span>
                            <span>{new Date(detailsUser.profile.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'en-US')}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
