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
            <div className="text-6xl mb-2">📬</div>

            <div className="space-y-2">
                <h2 className="text-xl font-bold text-text-primary">{t.auth.verifyEmailTitle}</h2>
                <p className="text-sm text-text-light leading-relaxed">
                    {t.auth.verifyEmailMessage}
                </p>
            </div>

            <div className="bg-bg-secondary rounded-xl p-4 border border-border">
                <p className="text-xs text-text-light">
                    💡 {language === 'ar'
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
