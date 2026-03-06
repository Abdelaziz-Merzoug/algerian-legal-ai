'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Button from '@/components/ui/Button';

export default function HeroSection() {
    const { t } = useTranslation();

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-teal/5 rounded-full blur-[120px] animate-pulse-gold" />
                <div className="absolute bottom-1/4 end-1/4 w-96 h-96 bg-teal/3 rounded-full blur-[120px] animate-pulse-gold" style={{ animationDelay: '1s' }} />
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-light border border-teal/20 rounded-full text-sm text-teal mb-8 animate-fade-in">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span>{t.landing.badge}</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gradient-gold leading-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    {t.landing.heroTitle}
                </h1>

                {/* Subtitle */}
                <p className="text-lg sm:text-xl text-text-light max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {t.landing.heroSubtitle}
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <Link href="/register">
                        <Button size="lg" variant="primary">
                            {t.landing.getStarted}
                            <span className="rtl:rotate-180">→</span>
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button size="lg" variant="secondary">
                            {t.landing.tryNow}
                        </Button>
                    </Link>
                </div>

                {/* Trust text */}
                <p className="mt-8 text-xs text-text-muted animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    {t.landing.trustedBy}
                </p>
            </div>
        </section>
    );
}
