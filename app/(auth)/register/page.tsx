'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/hooks/useToast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
    const { t } = useTranslation();
    const { register } = useAuth();
    const toast = useToast();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Password strength
    const passwordStrength = useMemo(() => {
        if (!password) return { level: 0, label: '' };
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) return { level: 1, label: t.auth.weak, color: 'bg-error' };
        if (score <= 3) return { level: 2, label: t.auth.medium, color: 'bg-warning' };
        return { level: 3, label: t.auth.strong, color: 'bg-success' };
    }, [password, t]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!username.trim()) newErrors.username = t.errors.required;
        else if (username.trim().length < 3) newErrors.username = t.errors.usernameMin;
        else if (username.trim().length > 30) newErrors.username = t.errors.usernameMax;

        if (!email.trim()) newErrors.email = t.errors.required;
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = t.errors.invalidEmail;

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
            await register(email, password, username.trim());
            toast.success(t.common.success);
            router.push('/verify-email');
        } catch {
            toast.error(t.errors.registerFailed);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-text-primary">{t.auth.registerTitle}</h2>
                <p className="text-sm text-text-light mt-1">{t.auth.registerSubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                    type="text"
                    label={t.auth.username}
                    placeholder={t.auth.usernamePlaceholder}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={errors.username}
                    autoComplete="username"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    }
                />

                <Input
                    type="email"
                    label={t.auth.email}
                    placeholder={t.auth.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    autoComplete="email"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    }
                />

                <div>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        label={t.auth.password}
                        placeholder={t.auth.passwordPlaceholder}
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
                                {showPassword ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        }
                    />
                    {/* Password strength */}
                    {password && (
                        <div className="mt-2 space-y-1">
                            <div className="flex gap-1">
                                {[1, 2, 3].map((level) => (
                                    <div
                                        key={level}
                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.level
                                                ? passwordStrength.color
                                                : 'bg-border'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-text-light">
                                {t.auth.passwordStrength}: {passwordStrength.label}
                            </p>
                        </div>
                    )}
                </div>

                <Input
                    type={showPassword ? 'text' : 'password'}
                    label={t.auth.confirmPassword}
                    placeholder={t.auth.confirmPasswordPlaceholder}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    }
                />

                <Button
                    type="submit"
                    fullWidth
                    isLoading={isLoading}
                    size="lg"
                >
                    {isLoading ? t.auth.registering : t.auth.registerButton}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-text-light">
                {t.auth.hasAccount}{' '}
                <Link
                    href="/login"
                    className="text-teal hover:text-teal-hover font-semibold transition-colors"
                >
                    {t.common.login}
                </Link>
            </p>
        </div>
    );
}
