'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/hooks/useToast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
    const { t } = useTranslation();
    const { forgotPassword } = useAuth();
    const toast = useToast();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            setError(t.errors.required);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError(t.errors.invalidEmail);
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            await forgotPassword(email);
            setSent(true);
            toast.success(t.auth.resetSent);
        } catch {
            toast.error(t.errors.serverError);
        } finally {
            setIsLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="text-center space-y-4">
                <div className="text-5xl">📧</div>
                <h2 className="text-xl font-bold text-text-primary">{t.auth.resetSent}</h2>
                <p className="text-sm text-text-light">{t.auth.verifyEmailMessage}</p>
                <Link
                    href="/login"
                    className="inline-block mt-4 text-teal hover:text-teal-hover font-semibold transition-colors"
                >
                    {t.common.back} → {t.common.login}
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-text-primary">{t.auth.forgotPasswordTitle}</h2>
                <p className="text-sm text-text-light mt-1">{t.auth.forgotPasswordSubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                    type="email"
                    label={t.auth.email}
                    placeholder={t.auth.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error}
                    autoComplete="email"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    }
                />

                <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                    {t.auth.sendResetLink}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-text-light">
                <Link
                    href="/login"
                    className="text-teal hover:text-teal-hover font-semibold transition-colors"
                >
                    {t.common.back} → {t.common.login}
                </Link>
            </p>
        </div>
    );
}
