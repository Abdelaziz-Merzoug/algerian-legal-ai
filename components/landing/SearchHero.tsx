'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function SearchHero() {
    const { t } = useTranslation();
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        } else {
            router.push('/chat');
        }
    };

    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pb-8">
            {/* Animated gradient mesh background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-secondary to-[#0c1e3d]" />
                <div className="absolute top-0 start-1/4 w-[600px] h-[600px] bg-teal/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 end-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal/3 rounded-full blur-[150px]" />
            </div>

            {/* Subtle grid overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
            }} />

            <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center">
                {/* Justice scales SVG — allowed icon */}
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-teal/10 border border-teal/20 flex items-center justify-center">
                        <svg width="44" height="44" viewBox="0 0 100 100" className="text-teal" aria-hidden="true">
                            <line x1="50" y1="15" x2="50" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            <line x1="18" y1="30" x2="82" y2="30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            <path d="M 18 30 Q 8 55 18 58 Q 28 58 18 30" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M 82 30 Q 72 55 82 58 Q 92 58 82 30" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            <rect x="42" y="70" width="16" height="5" rx="2" fill="currentColor" />
                            <rect x="37" y="75" width="26" height="4" rx="2" fill="currentColor" opacity="0.7" />
                            <circle cx="50" cy="14" r="5" fill="currentColor" />
                        </svg>
                    </div>
                </div>

                {/* Platform badge */}
                <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/20 rounded-full px-4 py-1.5 mb-8">
                    <span className="text-xs font-semibold text-teal">{t.landing.badge}</span>
                </div>

                {/* Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-5 leading-tight">
                    <span className="text-gradient-gold">البوابة الذكية</span>
                    <br />
                    <span className="text-text-primary">للقانون الجزائري</span>
                </h1>

                {/* Subtitle */}
                <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                    {t.landing.heroSubtitle}
                </p>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto mb-8">
                    <div className="relative flex items-center bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:border-teal/40 transition-colors focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/20">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="اسأل سؤالك القانوني..."
                            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted px-5 py-4 text-sm outline-none leading-relaxed"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-teal hover:bg-teal-hover text-white font-bold px-6 py-4 transition-colors text-sm flex items-center gap-2 shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="hidden sm:inline">{t.common.search}</span>
                        </button>
                    </div>
                </div>

                {/* Trust line */}
                <p className="text-xs text-text-muted flex items-center justify-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-teal shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {t.landing.trustedBy}
                </p>
            </div>
        </section>
    );
}
