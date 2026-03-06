'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/useTranslation';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { SearchIcon } from '@/components/ui/Icon';

interface SearchResult {
    id: string;
    article_number: string | null;
    content: string;
    document_title_ar: string;
    document_title_en: string;
    category_name_ar: string;
    category_name_en: string;
}

interface Category {
    id: string;
    name_ar: string;
    name_en: string;
}

export default function SearchPage() {
    const { t, language } = useTranslation();
    const searchParams = useSearchParams();
    const initialQ = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQ);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetch('/api/categories')
            .then((r) => r.json())
            .then((data) => setCategories(data))
            .catch(() => { });
    }, []);

    const doSearch = useCallback(async (q: string, p: number, cat: string) => {
        if (!q.trim() || q.trim().length < 2) return;
        setIsLoading(true);
        try {
            const params = new URLSearchParams({ q: q.trim(), page: String(p) });
            if (cat) params.set('category', cat);
            const res = await fetch(`/api/search?${params}`);
            const data = await res.json();
            setResults(data.results);
            setTotal(data.total);
            setTotalPages(data.totalPages);
            setPage(data.page);
        } catch { /* ignore */ }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (initialQ) doSearch(initialQ, 1, '');
    }, [initialQ, doSearch]);

    const handleSearch = () => {
        setPage(1);
        doSearch(query, 1, selectedCategory);
    };

    const highlightText = (text: string, q: string) => {
        if (!q.trim()) return text;
        const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === q.toLowerCase()
                ? <mark key={i} className="bg-teal/30 text-text-primary px-0.5 rounded">{part}</mark>
                : part
        );
    };

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col">
            <Navbar />
            <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3 leading-tight">{t.search.title}</h1>
                        <p className="text-base text-text-secondary leading-relaxed">{t.search.subtitle}</p>
                    </div>

                    {/* Search bar */}
                    <div className="max-w-2xl mx-auto mb-10">
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder={t.search.placeholder}
                                className="flex-1 bg-white border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary/40 transition-colors shadow-sm"
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm flex items-center gap-2"
                            >
                                <SearchIcon className="w-4 h-4" />
                                <span className="sr-only">{t.common.search}</span>
                            </button>
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => { setSelectedCategory(e.target.value); doSearch(query, 1, e.target.value); }}
                            className="w-full bg-bg-card border border-border-light rounded-xl px-4 py-2.5 text-sm text-text-secondary outline-none focus:border-primary/40"
                        >
                            <option value="">{t.search.filterByCategory}</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{language === 'ar' ? c.name_ar : c.name_en}</option>
                            ))}
                        </select>
                    </div>

                    {/* Results */}
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-bg-card border border-border rounded-xl p-4">
                                    <SkeletonLoader height="14px" width="30%" className="mb-2" />
                                    <SkeletonLoader height="12px" width="80%" className="mb-1" />
                                    <SkeletonLoader height="12px" width="60%" />
                                </div>
                            ))}
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <p className="text-xs text-text-light mb-4">
                                {t.search.resultsFor} &quot;{query}&quot; — {total} {t.common.results}
                            </p>
                            <div className="space-y-3">
                                {results.map((r) => (
                                    <div key={r.id} className="bg-bg-card shadow-sm border border-border-light rounded-xl p-5 transition-all hover:border-teal/20">
                                        <div className="flex items-start gap-3 mb-2">
                                            {r.article_number && (
                                                <span className="bg-teal/10 text-teal text-xs font-bold px-2 py-0.5 rounded">
                                                    {t.chat.article} {r.article_number}
                                                </span>
                                            )}
                                            <span className="text-xs text-text-light">
                                                {language === 'ar' ? r.category_name_ar : r.category_name_en}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-text-primary mb-1.5">
                                            {language === 'ar' ? r.document_title_ar : (r.document_title_en || r.document_title_ar)}
                                        </h3>
                                        <p className="text-xs text-text-light leading-relaxed line-clamp-3">
                                            {highlightText(r.content, query)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <button
                                        onClick={() => doSearch(query, page - 1, selectedCategory)}
                                        disabled={page <= 1}
                                        className="px-3 py-1.5 text-sm text-teal border border-teal/30 rounded-lg disabled:opacity-30 hover:bg-teal-light transition-colors"
                                    >
                                        {t.common.previous}
                                    </button>
                                    <span className="text-xs text-text-light">{page} / {totalPages}</span>
                                    <button
                                        onClick={() => doSearch(query, page + 1, selectedCategory)}
                                        disabled={page >= totalPages}
                                        className="px-3 py-1.5 text-sm text-teal border border-teal/30 rounded-lg disabled:opacity-30 hover:bg-teal-light transition-colors"
                                    >
                                        {t.common.next}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : query && !isLoading ? (
                        <div className="text-center py-16 text-text-secondary">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-border-light flex items-center justify-center">
                                <SearchIcon className="w-6 h-6 text-text-muted" />
                            </div>
                            <p className="text-sm mb-1">{t.search.noResults}</p>
                            <p className="text-xs text-text-muted">{t.search.tryDifferent}</p>
                        </div>
                    ) : null}
                </div>
            </main>
            <Footer />
        </div>
    );
}
