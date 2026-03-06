'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/hooks/useToast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProfileData {
    profile: { id: string; email: string; username: string; created_at: string };
    stats: { totalConversations: number; totalMessages: number };
}

export default function ProfilePage() {
    const { t, language } = useTranslation();
    const { user, isLoading: authLoading, resetPassword, logout } = useAuth();
    const toast = useToast();

    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    const [editUsername, setEditUsername] = useState('');
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [feedbackSubject, setFeedbackSubject] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState('general');
    const [isSendingFeedback, setIsSendingFeedback] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    const fetchProfile = useCallback(async () => {
        try {
            const res = await fetch('/api/profile');
            if (res.ok) {
                const data = await res.json();
                setProfileData(data);
                setEditUsername(data.profile.username || '');
            }
        } catch { toast.error(t.errors.serverError); }
        finally { setIsLoadingProfile(false); }
    }, []);

    useEffect(() => { if (user) fetchProfile(); }, [user, fetchProfile]);

    const handleSaveProfile = async () => {
        if (!editUsername.trim() || editUsername.trim().length < 3) { toast.error(t.errors.usernameMin); return; }
        setIsSavingProfile(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: editUsername.trim() }),
            });
            if (res.ok) {
                toast.success(t.profile.profileUpdated);
                setProfileData(prev => prev ? { ...prev, profile: { ...prev.profile, username: editUsername.trim() } } : prev);
            } else toast.error(t.errors.serverError);
        } catch { toast.error(t.errors.serverError); }
        finally { setIsSavingProfile(false); }
    };

    const handleChangePassword = async () => {
        if (!newPassword || newPassword.length < 6) { toast.error(t.errors.passwordMin); return; }
        if (newPassword !== confirmPassword) { toast.error(t.errors.passwordMatch); return; }
        setIsSavingPassword(true);
        try {
            await resetPassword(newPassword);
            toast.success(t.profile.passwordUpdated);
            setNewPassword(''); setConfirmPassword('');
        } catch { toast.error(t.errors.serverError); }
        finally { setIsSavingPassword(false); }
    };

    const handleSendFeedback = async () => {
        if (!feedbackSubject.trim() || !feedbackMessage.trim()) { toast.error(t.errors.required); return; }
        setIsSendingFeedback(true);
        try {
            const res = await fetch('/api/feedback', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject: feedbackSubject, message: feedbackMessage, type: feedbackType }),
            });
            if (res.ok) {
                toast.success(t.profile.feedbackSent);
                setFeedbackSubject(''); setFeedbackMessage(''); setFeedbackType('general');
            } else toast.error(t.errors.serverError);
        } catch { toast.error(t.errors.serverError); }
        finally { setIsSendingFeedback(false); }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirm !== 'DELETE') {
            toast.error(language === 'ar' ? 'يرجى كتابة DELETE للتأكيد' : 'Please type DELETE to confirm');
            return;
        }
        setIsDeletingAccount(true);
        try {
            const res = await fetch('/api/profile/delete-account', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirmation: 'DELETE' }),
            });
            if (res.ok) {
                toast.success(language === 'ar' ? 'تم حذف الحساب' : 'Account deleted');
                await logout();
            } else {
                const data = await res.json();
                toast.error(data.error || t.errors.serverError);
            }
        } catch { toast.error(t.errors.serverError); }
        finally { setIsDeletingAccount(false); }
    };

    if (authLoading || isLoadingProfile) return <LoadingSpinner fullScreen />;

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar />
            <main className="pt-20 pb-12 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h1 className="text-2xl font-bold text-text-primary">{t.profile.title}</h1>

                    {/* Account Info */}
                    <Card padding="lg">
                        <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {t.profile.accountInfo}
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 pb-4 border-b border-border">
                                <div className="w-14 h-14 rounded-full bg-teal/10 border-2 border-teal/40 flex items-center justify-center text-teal text-xl font-bold">
                                    {(profileData?.profile.username || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-text-primary font-semibold">{profileData?.profile.username}</p>
                                    <p className="text-sm text-text-secondary">{user?.email}</p>
                                    <p className="text-xs text-text-muted mt-1">
                                        {t.profile.memberSince}: {new Date(profileData?.profile.created_at || '').toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'en-US')}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Input type="text" label={t.auth.username} value={editUsername} onChange={e => setEditUsername(e.target.value)} placeholder={t.auth.usernamePlaceholder} />
                                <Button onClick={handleSaveProfile} isLoading={isSavingProfile} size="sm">{t.common.save}</Button>
                            </div>
                        </div>
                    </Card>

                    {/* Usage Stats */}
                    <Card padding="lg">
                        <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            {t.profile.usageStats}
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-bg-secondary rounded-xl p-4 text-center border border-border-light">
                                <p className="text-3xl font-bold text-teal">{profileData?.stats.totalConversations || 0}</p>
                                <p className="text-xs text-text-muted mt-1">{t.profile.totalConversations}</p>
                            </div>
                            <div className="bg-bg-secondary rounded-xl p-4 text-center border border-border-light">
                                <p className="text-3xl font-bold text-teal">{profileData?.stats.totalMessages || 0}</p>
                                <p className="text-xs text-text-muted mt-1">{t.profile.totalMessages}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Change Password */}
                    <Card padding="lg">
                        <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            {t.profile.changePassword}
                        </h2>
                        <div className="space-y-3">
                            <Input type="password" label={t.auth.newPassword} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder={t.auth.newPasswordPlaceholder} />
                            <Input type="password" label={t.auth.confirmPassword} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder={t.auth.confirmPasswordPlaceholder} />
                            <Button onClick={handleChangePassword} isLoading={isSavingPassword} size="sm">{t.profile.changePassword}</Button>
                        </div>
                    </Card>

                    {/* Send Feedback */}
                    <Card padding="lg">
                        <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            {t.profile.sendFeedback}
                        </h2>
                        <div className="space-y-3">
                            <Select label={t.profile.feedbackType} value={feedbackType} onChange={e => setFeedbackType(e.target.value)}
                                options={[
                                    { value: 'general', label: t.feedback.types.general },
                                    { value: 'bug', label: t.feedback.types.bug },
                                    { value: 'feature', label: t.feedback.types.feature },
                                    { value: 'complaint', label: t.feedback.types.complaint },
                                    { value: 'praise', label: t.feedback.types.praise },
                                ]} />
                            <Input type="text" label={t.profile.feedbackSubject} value={feedbackSubject} onChange={e => setFeedbackSubject(e.target.value)} placeholder={t.profile.feedbackSubjectPlaceholder} />
                            <Textarea label={t.profile.feedbackMessage} value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} placeholder={t.profile.feedbackMessagePlaceholder} rows={4} />
                            <Button onClick={handleSendFeedback} isLoading={isSendingFeedback} size="sm">{t.common.submit}</Button>
                        </div>
                    </Card>

                    {/* Logout */}
                    <Card padding="lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-text-primary">{t.common.logout}</h3>
                                <p className="text-xs text-text-muted mt-1">{language === 'ar' ? 'تسجيل الخروج من حسابك' : 'Sign out of your account'}</p>
                            </div>
                            <Button variant="secondary" size="sm" onClick={logout}>{t.common.logout}</Button>
                        </div>
                    </Card>

                    {/* Danger Zone — Delete Account */}
                    <Card padding="lg">
                        <div className="border border-error/30 rounded-xl p-4 bg-error/5 space-y-3">
                            <h3 className="text-sm font-bold text-error flex items-center gap-2">
                                ⚠️ {language === 'ar' ? 'منطقة الخطر — حذف الحساب' : 'Danger Zone — Delete Account'}
                            </h3>
                            <p className="text-xs text-text-secondary">
                                {language === 'ar'
                                    ? 'حذف حسابك سيحذف جميع بياناتك بما فيها المحادثات والرسائل بشكل نهائي لا يمكن التراجع عنه.'
                                    : 'Deleting your account will permanently remove all your data including conversations and messages. This cannot be undone.'}
                            </p>
                            <Input
                                label={language === 'ar' ? 'اكتب DELETE للتأكيد' : 'Type DELETE to confirm'}
                                value={deleteConfirm}
                                onChange={e => setDeleteConfirm(e.target.value)}
                                placeholder="DELETE"
                            />
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={handleDeleteAccount}
                                isLoading={isDeletingAccount}
                                disabled={deleteConfirm !== 'DELETE'}
                            >
                                🗑️ {language === 'ar' ? 'حذف حسابي نهائياً' : 'Permanently Delete My Account'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
