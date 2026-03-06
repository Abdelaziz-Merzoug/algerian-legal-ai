'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Button from '@/components/ui/Button';

export default function CTASection() {
    const { t } = useTranslation();

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-4">
                    {t.landing.ctaTitle}
                </h2>
                <p className="text-lg text-text-light mb-8 max-w-xl mx-auto">
                    {t.landing.ctaSubtitle}
                </p>
                <Link href="/register">
                    <Button size="lg" variant="primary">
                        {t.landing.ctaButton}
                        <span className="rtl:rotate-180">→</span>
                    </Button>
                </Link>
            </div>
        </section>
    );
}
