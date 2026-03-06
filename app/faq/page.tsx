'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Accordion from '@/components/ui/Accordion';
import { HelpCircleIcon } from '@/components/ui/Icon';

export default function FAQPage() {
    const { t } = useTranslation();

    const faqItems = [
        { id: '1', title: t.faq.q1, content: t.faq.a1 },
        { id: '2', title: t.faq.q2, content: t.faq.a2 },
        { id: '3', title: t.faq.q3, content: t.faq.a3 },
        { id: '4', title: t.faq.q4, content: t.faq.a4 },
        { id: '5', title: t.faq.q5, content: t.faq.a5 },
        { id: '6', title: t.faq.q6, content: t.faq.a6 },
        { id: '7', title: t.faq.q7, content: t.faq.a7 },
        { id: '8', title: t.faq.q8, content: t.faq.a8 },
        { id: '9', title: t.faq.q9, content: t.faq.a9 },
        { id: '10', title: t.faq.q10, content: t.faq.a10 },
    ];

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col">
            <Navbar />
            <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <HelpCircleIcon className="w-7 h-7 text-primary" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3 leading-tight">{t.faq.title}</h1>
                        <p className="text-base text-text-secondary leading-relaxed">{t.faq.subtitle}</p>
                    </div>

                    <Accordion items={faqItems} />

                    {/* Contact CTA */}
                    <div className="text-center mt-12 text-text-secondary">
                        <p className="text-sm mb-3">
                            {t.faq.q6.replace('؟', '').replace('?', '')}?
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover text-sm font-medium transition-colors underline-offset-2 hover:underline"
                        >
                            {t.contact.title} →
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
