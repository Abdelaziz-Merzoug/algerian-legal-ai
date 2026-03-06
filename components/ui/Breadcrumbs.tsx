'use client';

import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/i18n/useTranslation';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
    const { language } = useTranslation();

    return (
        <nav
            aria-label={language === 'ar' ? 'مسار التنقل' : 'Breadcrumb'}
            className={`flex items-center gap-1.5 flex-wrap text-sm text-text-muted mb-6 ${className}`}
        >
            {/* Home */}
            <Link
                href="/"
                className="flex items-center gap-1 hover:text-primary transition-colors shrink-0"
            >
                <HomeIcon className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
            </Link>

            {/* Dynamic segments */}
            {items.map((item, idx) => (
                <span key={idx} className="flex items-center gap-1.5 shrink-0">
                    {/* separator — flips in RTL automatically via logical props */}
                    <ChevronRightIcon
                        className="w-3.5 h-3.5 shrink-0 rtl:rotate-180"
                        strokeWidth={2}
                    />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-primary transition-colors truncate max-w-[160px]"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-text-primary font-medium truncate max-w-[200px]">
                            {item.label}
                        </span>
                    )}
                </span>
            ))}
        </nav>
    );
}
