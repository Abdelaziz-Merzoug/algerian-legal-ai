'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    const { t } = useTranslation();

    if (totalPages <= 1) return null;

    // Generate page numbers to show
    const getPageNumbers = (): (number | '...')[] => {
        const pages: (number | '...')[] = [];
        const delta = 1; // pages around current

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }

        return pages;
    };

    return (
        <nav className="flex items-center justify-center gap-1.5 mt-6" aria-label="Pagination">
            {/* Previous */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-2 text-sm rounded-lg text-text-light hover:text-teal hover:bg-bg-card disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label={t.common.previous}
            >
                {t.common.previous}
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, idx) =>
                page === '...' ? (
                    <span
                        key={`ellipsis-${idx}`}
                        className="px-2 py-2 text-sm text-text-light"
                        aria-hidden="true"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`
              min-w-[36px] h-9 text-sm rounded-lg font-medium transition-all duration-200
              ${page === currentPage
                                ? 'bg-teal text-navy shadow-md shadow-gold/20'
                                : 'text-text-light hover:text-teal hover:bg-bg-card'
                            }
            `}
                        aria-current={page === currentPage ? 'page' : undefined}
                        aria-label={`Page ${page}`}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-2 text-sm rounded-lg text-text-light hover:text-teal hover:bg-bg-card disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label={t.common.next}
            >
                {t.common.next}
            </button>
        </nav>
    );
}
