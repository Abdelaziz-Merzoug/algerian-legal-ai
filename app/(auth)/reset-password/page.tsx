'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/hooks/useToast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ResetPasswordPage() {
    const { t } = useTranslation();
    const { resetPassword } = useAuth();
    const toast = useToast();
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!password) newErrors.password = t.errors.required;
        else if (password.length < 6) newErrors.password = t.errors.passwordMin;
        if (!confirmPassword) newErrors.confirmPassword = t.errors.required;
        else if (password !== confirmPassword) newErrors.confirmPassword = t.errors.passwordMatch;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            await resetPassword(password);
            toast.success(t.profile.passwordUpdated);
            router.push('/login');
        } catch {
            toast.error(t.errors.serverError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-text-primary">{t.auth.resetPasswordTitle}</h2>
                <p className="text-sm text-text-light mt-1">{t.auth.resetPasswordSubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                    type={showPassword ? 'text' : 'password'}
                    label={t.auth.newPassword}
                    placeholder={t.auth.newPasswordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    autoComplete="new-password"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    }
                    endIcon={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-text-light hover:text-teal transition-colors"
                            aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    }
                />

                <Input
                    type={showPassword ? 'text' : 'password'}
                    label={t.auth.confirmPassword}
                    placeholder={t.auth.confirmPasswordPlaceholder}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                />

                <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                    {t.auth.resetPassword}
                </Button>
            </form>
        </div>
    );
}
