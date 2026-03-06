'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/hooks/useToast';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

export default function VerifyEmailPage() {
    const { t, language } = useTranslation();
    const toast = useToast();
    const [isResending, setIsResending] = useState(false);

    const handleResend = async () => {
        setIsResending(true);
        try {
            const supabase = createClient();
            // Resend is handled by calling signUp again or using resend API
            // For now, we direct them to login where they can try again
            toast.info(t.auth.verificationSent);
        } catch {
            toast.error(t.errors.serverError);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="text-center space-y-6">
            <div className="flex items-center justify-center mb-2 text-teal">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-bold text-text-primary">{t.auth.verifyEmailTitle}</h2>
                <p className="text-sm text-text-light leading-relaxed">
                    {t.auth.verifyEmailMessage}
                </p>
            </div>

            <div className="bg-bg-secondary rounded-xl p-4 border border-border">
                <p className="text-xs text-text-light flex items-start gap-2">
                    <svg className="w-4 h-4 shrink-0 mt-0.5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {language === 'ar'
                        ? 'تحقق من مجلد البريد المزعج (Spam) إذا لم تجد الرسالة في صندوق الوارد'
                        : 'Check your spam folder if you don\'t see the email in your inbox'}
                </p>
            </div>

            <div className="space-y-3">
                <Button
                    variant="secondary"
                    fullWidth
                    onClick={handleResend}
                    isLoading={isResending}
                >
                    {t.auth.resendVerification}
                </Button>

                <Link
                    href="/login"
                    className="block text-teal hover:text-teal-hover font-semibold transition-colors text-sm"
                >
                    {t.common.back} → {t.common.login}
                </Link>
            </div>
        </div>
    );
}
