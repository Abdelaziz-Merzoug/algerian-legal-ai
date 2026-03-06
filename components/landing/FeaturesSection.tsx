'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { SearchIcon, DocumentCheckIcon, GlobeIcon, FreeIcon, ShieldIcon, LightningIcon } from '@/components/icons/LegalIcons';

const featureSVGs = [SearchIcon, DocumentCheckIcon, GlobeIcon, FreeIcon, ShieldIcon, LightningIcon];

export default function FeaturesSection() {
    const { t } = useTranslation();

    const features = [
        { Icon: featureSVGs[0], title: t.landing.feature1Title, desc: t.landing.feature1Desc },
        { Icon: featureSVGs[1], title: t.landing.feature2Title, desc: t.landing.feature2Desc },
        { Icon: featureSVGs[2], title: t.landing.feature3Title, desc: t.landing.feature3Desc },
        { Icon: featureSVGs[3], title: t.landing.feature4Title, desc: t.landing.feature4Desc },
        { Icon: featureSVGs[4], title: t.landing.feature5Title, desc: t.landing.feature5Desc },
        { Icon: featureSVGs[5], title: t.landing.feature6Title, desc: t.landing.feature6Desc },
    ];

    return (
        <section className="py-16 md:py-24 px-6 sm:px-8 lg:px-12" id="features">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4 leading-tight">
                        {t.landing.featuresTitle}
                    </h2>
                    <p className="text-base text-text-secondary leading-relaxed max-w-xl mx-auto">
                        {t.landing.featuresSubtitle}
                    </p>
                </div>

                {/* Feature cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map(({ Icon, title, desc }, idx) => (
                        <div
                            key={idx}
                            className="p-8 bg-white border border-border rounded-xl hover:shadow-md hover:border-teal/30 transition-all duration-200 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-6 group-hover:bg-teal/20 transition-colors">
                                <Icon className="w-6 h-6 text-teal" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-text-primary mb-3 leading-tight">
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
