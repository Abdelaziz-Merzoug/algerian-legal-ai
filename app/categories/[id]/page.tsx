'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/useTranslation';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { getCategoryIcon } from '@/components/icons/LegalIcons';

interface CategoryDetail {
    id: string;
    name_ar: string;
    name_en: string;
    description_ar: string | null;
    description_en: string | null;
    icon: string;
}

interface DocumentItem {
    id: string;
    title_ar: string;
    title_en: string | null;
    document_type: string;
    source: string | null;
    year: number | null;
    article_count: number;
    created_at: string;
}

interface ArticleItem {
    id: string;
    article_number: string | null;
    content: string;
}

export default function CategoryDetailPage() {
    const { t, language } = useTranslation();
    const params = useParams();
    const id = params.id as string;

    const [category, setCategory] = useState<CategoryDetail | null>(null);
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
    const [articles, setArticles] = useState<Record<string, ArticleItem[]>>({});
    const [loadingArticles, setLoadingArticles] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/categories/${id}`)
            .then((r) => r.json())
            .then((data) => {
                setCategory(data.category);
                setDocuments(data.documents || []);
            })
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, [id]);

    const loadArticles = async (docId: string) => {
        if (articles[docId]) {
            setExpandedDoc(expandedDoc === docId ? null : docId);
            return;
        }
        setLoadingArticles(docId);
        setExpandedDoc(docId);
        try {
            const res = await fetch(`/api/categories/${id}?docId=${docId}&articles=true`);
            const data = await res.json();
            setArticles((prev) => ({ ...prev, [docId]: data.articles || [] }));
        } catch { /* ignore */ }
        setLoadingArticles(null);
    };

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar />
            <main className="pt-24 pb-16 px-6 sm:px-8 lg:px-12 max-w-5xl mx-auto">
                {/* Back link */}
                <Link href="/categories" className="inline-flex items-center gap-1 text-sm text-teal hover:text-teal-hover transition-colors mb-6">
                    <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {t.categories.backToCategories}
                </Link>

                {isLoading ? (
                    <div className="space-y-4">
                        <SkeletonLoader height="32px" width="40%" />
                        <SkeletonLoader height="16px" width="70%" />
                        <div className="space-y-3 mt-8">
                            {[1, 2, 3].map((i) => (
                                <SkeletonLoader key={i} variant="card" />
                            ))}
                        </div>
                    </div>
                ) : category ? (
                    <>
                        {/* Category header */}
                        <div className="flex items-center gap-4 mb-8">
                            {/* SVG icon from getCategoryIcon helper */}
                            <div className="w-14 h-14 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center shrink-0">
                                {(() => { const I = getCategoryIcon(language === 'ar' ? category.name_ar : category.name_en); return <I className="w-7 h-7 text-teal" />; })()}
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
                                    {language === 'ar' ? category.name_ar : category.name_en}
                                </h1>
                                <p className="text-text-secondary text-sm mt-1 leading-relaxed">
                                    {language === 'ar' ? category.description_ar : category.description_en}
                                    {' · '}{documents.length} {t.categories.documentsCount}
                                </p>
                            </div>
                        </div>

                        {/* Documents list */}
                        {documents.length === 0 ? (
                            <div className="text-center py-16 text-text-secondary">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-border-light flex items-center justify-center">
                                    <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12" />
                                    </svg>
                                </div>
                                <p className="text-sm">{t.categories.noDocuments}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="bg-white border border-border rounded-xl overflow-hidden hover:border-teal/30 hover:shadow-sm transition-all duration-200">
                                        <button
                                            onClick={() => loadArticles(doc.id)}
                                            className="w-full flex items-center justify-between p-5 text-start hover:bg-bg-secondary/50 transition-colors"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold text-text-primary leading-tight break-words">
                                                    {language === 'ar' ? doc.title_ar : (doc.title_en || doc.title_ar)}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1.5 text-xs text-text-muted">
                                                    {doc.year && <span>{doc.year}</span>}
                                                    {doc.source && doc.year && <span>·</span>}
                                                    {doc.source && <span>{doc.source}</span>}
                                                    <span className="text-teal">{doc.article_count} {t.categories.articlesCount}</span>
                                                </div>
                                            </div>
                                            <span className={`text-gold text-sm transition-transform ${expandedDoc === doc.id ? 'rotate-90' : ''}`}>
                                                ▸
                                            </span>
                                        </button>

                                        {/* Expanded articles */}
                                        {expandedDoc === doc.id && (
                                            <div className="border-t border-white/5 bg-navy/30 px-5 py-4">
                                                {loadingArticles === doc.id ? (
                                                    <div className="space-y-2">
                                                        <SkeletonLoader count={3} height="40px" />
                                                    </div>
                                                ) : articles[doc.id]?.length ? (
                                                    <div className="space-y-2 max-h-80 overflow-y-auto">
                                                        {articles[doc.id].map((art) => (
                                                            <div key={art.id} className="bg-navy-secondary/30 border-s-2 border-gold/40 rounded-e-lg p-3">
                                                                {art.article_number && (
                                                                    <span className="text-xs font-bold text-gold mb-1 block">
                                                                        {t.chat.article} {art.article_number}
                                                                    </span>
                                                                )}
                                                                <p className="text-xs text-text-light leading-relaxed line-clamp-4">
                                                                    {art.content}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-text-light">{t.common.noResults}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16 text-text-secondary">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-border-light flex items-center justify-center">
                            <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-sm">{t.errors.notFound}</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
