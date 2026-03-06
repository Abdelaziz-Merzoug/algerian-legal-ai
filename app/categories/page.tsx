'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { SkeletonStats } from '@/components/ui/SkeletonLoader';
import { getCategoryIcon } from '@/components/icons/LegalIcons';

interface Category {
    id: string;
    name_ar: string;
    name_en: string;
    description_ar: string | null;
    description_en: string | null;
    icon: string;
    document_count: number;
}

export default function CategoriesPage() {
    const { t, language } = useTranslation();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('/api/categories')
            .then((r) => r.json())
            .then((data) => setCategories(data))
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, []);

    const filtered = categories.filter((c) =>
        c.name_ar.includes(search) || c.name_en.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar />
            <main className="pt-24 pb-16 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-4 leading-tight">{t.categories.title}</h1>
                    <p className="text-base text-text-secondary leading-relaxed max-w-lg mx-auto">{t.categories.subtitle}</p>
                </div>

                {/* Search */}
                <div className="max-w-md mx-auto mb-10">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t.categories.searchPlaceholder}
                        className="w-full bg-bg-card shadow-sm border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-teal/40 transition-colors"
                    />
                </div>

                {/* Grid */}
                {isLoading ? (
                    <SkeletonStats count={6} />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filtered.map((cat) => {
                            const IconComponent = getCategoryIcon(language === 'ar' ? cat.name_ar : cat.name_en);
                            return (
                                <Link key={cat.id} href={`/categories/${cat.id}`}>
                                    <div className="bg-white border border-border rounded-xl p-6 md:p-8 hover:border-teal/40 hover:shadow-md transition-all duration-200 group cursor-pointer h-full">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center shrink-0 group-hover:bg-teal/20 transition-colors">
                                                <IconComponent className="w-6 h-6 text-teal" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-lg font-bold text-text-primary mb-1 leading-tight break-words">
                                                    {language === 'ar' ? cat.name_ar : cat.name_en}
                                                </h2>
                                                <p className="text-sm text-text-secondary leading-relaxed mb-3 line-clamp-2">
                                                    {language === 'ar' ? cat.description_ar : cat.description_en}
                                                </p>
                                                <span className="inline-flex items-center gap-1 text-xs text-teal font-medium bg-teal/10 rounded-full px-2.5 py-1">
                                                    {cat.document_count} {t.categories.documentsCount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {!isLoading && filtered.length === 0 && (
                    <div className="text-center py-16 text-text-secondary">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-border-light flex items-center justify-center">
                            <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="text-sm">{t.common.noResults}</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
