'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

export default function TrustSection() {
    const { language } = useTranslation();

    const checkmarks = [
        language === 'ar' ? 'نصوص رسمية' : 'Official Texts',
        language === 'ar' ? 'تحديث مستمر' : 'Continuously Updated',
        language === 'ar' ? 'مجاني تماماً' : 'Completely Free',
    ];

    return (
        <section className="py-16 md:py-24 px-6 sm:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto">
                <div className="bg-teal/5 border border-teal/20 rounded-2xl p-8 sm:p-12 text-center">
                    {/* Decorative flag bar — CSS only, no emoji */}
                    <div className="flex justify-center gap-1 mb-6">
                        <div className="h-1.5 w-10 rounded-full bg-text-muted/30" />
                        <div className="h-1.5 w-10 rounded-full bg-teal" />
                        <div className="h-1.5 w-10 rounded-full bg-text-muted/30" />
                    </div>

                    <p className="text-base sm:text-lg text-teal font-semibold leading-relaxed max-w-2xl mx-auto mb-6">
                        {language === 'ar'
                            ? 'منصة مبنية على النصوص القانونية الرسمية للجمهورية الجزائرية الديمقراطية الشعبية'
                            : "Built on the official legal texts of the People's Democratic Republic of Algeria"}
                    </p>

                    <div className="flex items-center justify-center flex-wrap gap-6 text-text-secondary">
                        {checkmarks.map((label) => (
                            <div key={label} className="flex items-center gap-2 text-sm">
                                <div className="w-4 h-4 rounded-full bg-teal/20 flex items-center justify-center shrink-0">
                                    <svg className="w-2.5 h-2.5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
