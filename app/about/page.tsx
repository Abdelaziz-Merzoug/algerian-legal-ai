'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { ScalesIcon, CPUIcon, BookOpenIcon, WarningIcon, CheckIcon } from '@/components/ui/Icon';

const sectionIcons = [ScalesIcon, CPUIcon, BookOpenIcon];

export default function AboutPage() {
    const { t, language } = useTranslation();

    const sections = [
        { Icon: sectionIcons[0], title: t.about.whatIsThis, content: t.about.whatIsThisDesc },
        { Icon: sectionIcons[1], title: t.about.howAiWorks, content: t.about.howAiWorksDesc },
        { Icon: sectionIcons[2], title: t.about.whatTexts, content: t.about.whatTextsDesc },
    ];

    const techStack = [
        { name: 'Next.js 15', abbr: 'NX' },
        { name: 'TypeScript', abbr: 'TS' },
        { name: 'Supabase', abbr: 'SB' },
        { name: 'Google Gemini', abbr: 'AI' },
        { name: 'Tailwind CSS', abbr: 'TW' },
        { name: 'pgvector', abbr: 'PG' },
    ];

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col">
            <Navbar />
            <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <ScalesIcon className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3 leading-tight">{t.about.title}</h1>
                        <p className="text-base text-text-secondary leading-relaxed max-w-lg mx-auto">{t.common.appDescription}</p>
                    </div>

                    {/* Info sections */}
                    <div className="space-y-4 mb-12">
                        {sections.map(({ Icon, title, content }, i) => (
                            <div key={i} className="bg-white border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-sm transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-base font-bold text-text-primary mb-2 leading-tight">{title}</h2>
                                        <p className="text-sm text-text-secondary leading-relaxed">{content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-12 text-center">
                        <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
                            <WarningIcon className="w-5 h-5 text-red-600" />
                        </div>
                        <p className="text-sm text-red-700 font-semibold leading-relaxed mb-1">{t.about.disclaimer}</p>
                        <p className="text-xs text-red-600/80 leading-relaxed">{t.about.disclaimerFull}</p>
                    </div>

                    {/* Tech stack */}
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-text-primary mb-6 leading-tight">{t.about.techStack}</h2>
                        <div className="flex flex-wrap justify-center gap-3">
                            {techStack.map((tech) => (
                                <div key={tech.name} className="bg-white border border-border rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-sm text-text-secondary hover:border-primary/30 hover:shadow-sm transition-all">
                                    <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                        {tech.abbr}
                                    </span>
                                    <span>{tech.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Algeria decoration — CSS only */}
                    <div className="text-center mt-12">
                        <div className="flex justify-center gap-1 mb-3">
                            <div className="h-1.5 w-8 rounded-full bg-text-muted/20" />
                            <div className="h-1.5 w-8 rounded-full bg-primary" />
                            <div className="h-1.5 w-8 rounded-full bg-text-muted/20" />
                        </div>
                        <p className="text-xs text-text-muted">
                            {language === 'ar'
                                ? 'الجمهورية الجزائرية الديمقراطية الشعبية'
                                : "People's Democratic Republic of Algeria"}
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
