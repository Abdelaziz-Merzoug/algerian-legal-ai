'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { WriteIcon, CPUIcon, DocumentCheckIcon } from '@/components/icons/LegalIcons';

const stepIcons = [WriteIcon, CPUIcon, DocumentCheckIcon];
const stepNumbers = ['01', '02', '03'];

export default function HowItWorksSection() {
    const { t } = useTranslation();

    const steps = [
        { Icon: stepIcons[0], num: stepNumbers[0], title: t.landing.step1Title, desc: t.landing.step1Desc },
        { Icon: stepIcons[1], num: stepNumbers[1], title: t.landing.step2Title, desc: t.landing.step2Desc },
        { Icon: stepIcons[2], num: stepNumbers[2], title: t.landing.step3Title, desc: t.landing.step3Desc },
    ];

    return (
        <section className="py-16 md:py-24 px-6 sm:px-8 lg:px-12 bg-bg-secondary border-y border-border-light" id="how-it-works">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4 leading-tight">
                        {t.landing.howItWorksTitle}
                    </h2>
                    <p className="text-base text-text-secondary leading-relaxed max-w-xl mx-auto">
                        {t.landing.howItWorksSubtitle}
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map(({ Icon, num, title, desc }, idx) => (
                        <div
                            key={idx}
                            className="relative bg-white border border-border rounded-2xl p-8 text-center group hover:border-teal/40 hover:shadow-md transition-all duration-200"
                        >
                            {/* Step number badge */}
                            <div className="absolute -top-4 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 bg-teal text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider">
                                {num}
                            </div>

                            {/* Icon */}
                            <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-6 mt-2 group-hover:bg-teal/20 transition-colors">
                                <Icon className="w-7 h-7 text-teal" />
                            </div>

                            <h3 className="text-lg font-bold text-text-primary mb-3 leading-tight">
                                {title}
                            </h3>
                            <p className="text-base text-text-secondary leading-relaxed">
                                {desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
