'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { SkeletonStats } from '@/components/ui/SkeletonLoader';
import { getCategoryIcon } from '@/components/icons/LegalIcons';

interface Category {
    id: string;
    name_ar: string;
    name_en: string;
    icon: string;
    document_count: number;
}

export default function CategoriesGrid() {
    const { t, language } = useTranslation();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/categories')
            .then((r) => r.json())
            .then((data) => setCategories(data))
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <section className="py-16 md:py-24 px-6 sm:px-8 lg:px-12 bg-bg-secondary border-t border-border-light">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4 leading-tight">
                        {t.categories.title}
                    </h2>
                    <p className="text-base text-text-secondary leading-relaxed max-w-lg mx-auto">
                        {t.categories.subtitle}
                    </p>
                </div>

                {isLoading ? (
                    <SkeletonStats count={6} />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                        {categories.map((cat) => {
                            const IconComponent = getCategoryIcon(
                                language === 'ar' ? cat.name_ar : cat.name_en
                            );
                            return (
                                <Link key={cat.id} href={`/categories/${cat.id}`}>
                                    <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-white border border-border rounded-xl hover:border-teal/50 hover:shadow-md transition-all duration-200 text-center min-h-[140px] group cursor-pointer">
                                        <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4 group-hover:bg-teal/20 transition-colors">
                                            <IconComponent className="w-6 h-6 text-teal" />
                                        </div>
                                        <h3 className="font-bold text-text-primary text-sm md:text-base mb-1 leading-tight break-words">
                                            {language === 'ar' ? cat.name_ar : cat.name_en}
                                        </h3>
                                        <span className="text-xs text-text-muted">
                                            {cat.document_count} {t.categories.documentsCount}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* View all link */}
                {!isLoading && categories.length > 0 && (
                    <div className="text-center mt-10">
                        <Link
                            href="/categories"
                            className="inline-flex items-center gap-2 text-teal hover:text-teal-hover text-sm font-medium transition-colors"
                        >
                            {t.categories.viewAll}
                            <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
