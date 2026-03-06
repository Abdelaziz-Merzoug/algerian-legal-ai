'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { createBrowserClient } from '@supabase/ssr';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { getCategoryIcon } from '@/components/icons/LegalIcons';

interface RecentDoc {
    id: string;
    title_ar: string;
    title_en: string | null;
    document_type: string;
    year: number | null;
    created_at: string;
    legal_categories: { name_ar: string; name_en: string; icon: string } | null;
}

export default function RecentDocuments() {
    const { t, language } = useTranslation();
    const [docs, setDocs] = useState<RecentDoc[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        supabase
            .from('legal_documents')
            .select('id, title_ar, title_en, document_type, year, created_at, legal_categories(name_ar, name_en, icon)')
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(5)
            .then(({ data }) => {
                if (data) setDocs(data as unknown as RecentDoc[]);
                setIsLoading(false);
            });
    }, []);

    if (!isLoading && docs.length === 0) return null;

    return (
        <section className="py-16 md:py-24 px-6 sm:px-8 lg:px-12 bg-bg-secondary border-y border-border-light">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4 leading-tight">
                        {language === 'ar' ? 'آخر النصوص المضافة' : 'Recently Added Texts'}
                    </h2>
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white border border-border rounded-xl p-5">
                                <SkeletonLoader height="16px" width="70%" className="mb-2" />
                                <SkeletonLoader height="12px" width="40%" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {docs.map((doc) => {
                            const catName = language === 'ar'
                                ? (doc.legal_categories?.name_ar || '')
                                : (doc.legal_categories?.name_en || '');
                            const IconComponent = getCategoryIcon(catName);
                            return (
                                <div
                                    key={doc.id}
                                    className="bg-white border border-border-light rounded-xl p-5 flex items-center gap-4 hover:border-teal/40 hover:shadow-sm transition-all duration-200"
                                >
                                    {/* Category icon container */}
                                    <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                                        <IconComponent className="w-5 h-5 text-teal" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-text-primary truncate leading-tight break-words">
                                            {language === 'ar' ? doc.title_ar : (doc.title_en || doc.title_ar)}
                                        </h3>
                                        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                                            {catName}
                                            {doc.year && ` • ${doc.year}`}
                                        </p>
                                    </div>
                                    <span className="text-xs text-text-muted shrink-0 hidden sm:block">
                                        {new Date(doc.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'en-US')}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
