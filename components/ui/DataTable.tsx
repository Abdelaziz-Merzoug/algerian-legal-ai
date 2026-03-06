'use client';

import React, { useState, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Input from './Input';
import Pagination from './Pagination';
import EmptyState from './EmptyState';

export interface Column<T> {
    key: string;
    header: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    searchable?: boolean;
    searchPlaceholder?: string;
    searchKey?: keyof T;
    pageSize?: number;
    emptyMessage?: string;
    emptyIcon?: React.ReactNode;
    isLoading?: boolean;
    actionColumn?: (item: T) => React.ReactNode;
    onRowClick?: (item: T) => void;
}

type SortDirection = 'asc' | 'desc' | null;

export default function DataTable<T extends Record<string, unknown>>({
    columns,
    data,
    searchable = false,
    searchPlaceholder,
    searchKey,
    pageSize = 10,
    emptyMessage,
    emptyIcon,
    isLoading = false,
    actionColumn,
    onRowClick,
}: DataTableProps<T>) {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDirection>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter
    const filtered = useMemo(() => {
        if (!search || !searchKey) return data;
        return data.filter((item) => {
            const val = item[searchKey];
            if (typeof val === 'string') {
                return val.toLowerCase().includes(search.toLowerCase());
            }
            return true;
        });
    }, [data, search, searchKey]);

    // Sort
    const sorted = useMemo(() => {
        if (!sortKey || !sortDir) return filtered;
        return [...filtered].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return 0;
        });
    }, [filtered, sortKey, sortDir]);

    // Paginate
    const totalPages = Math.ceil(sorted.length / pageSize);
    const paginated = sorted.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Handle sort toggle
    const handleSort = (key: string) => {
        if (sortKey === key) {
            if (sortDir === 'asc') setSortDir('desc');
            else if (sortDir === 'desc') {
                setSortKey(null);
                setSortDir(null);
            }
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
        setCurrentPage(1);
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="skeleton h-12 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            {searchable && (
                <div className="max-w-sm">
                    <Input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder={searchPlaceholder || t.common.search}
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        }
                    />
                </div>
            )}

            {/* Desktop Table */}
            {paginated.length === 0 ? (
                <EmptyState
                    icon={emptyIcon}
                    title={emptyMessage || t.common.noResults}
                />
            ) : (
                <>
                    <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-bg-secondary">
                                    {columns.map((col) => (
                                        <th
                                            key={col.key}
                                            className={`
                        px-4 py-3 text-sm font-semibold text-text-light text-start
                        ${col.sortable ? 'cursor-pointer hover:text-teal select-none' : ''}
                        ${col.className || ''}
                      `}
                                            onClick={col.sortable ? () => handleSort(col.key) : undefined}
                                            aria-sort={
                                                sortKey === col.key
                                                    ? sortDir === 'asc'
                                                        ? 'ascending'
                                                        : 'descending'
                                                    : undefined
                                            }
                                        >
                                            <span className="inline-flex items-center gap-1">
                                                {col.header}
                                                {col.sortable && sortKey === col.key && (
                                                    <span className="text-teal" aria-hidden="true">
                                                        {sortDir === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </span>
                                        </th>
                                    ))}
                                    {actionColumn && (
                                        <th className="px-4 py-3 text-sm font-semibold text-text-light text-start">
                                            {t.common.actions}
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {paginated.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className={`
                      hover:bg-bg-secondary transition-colors
                      ${onRowClick ? 'cursor-pointer' : ''}
                    `}
                                        onClick={() => onRowClick?.(item)}
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={col.key}
                                                className={`px-4 py-3 text-sm text-text-primary ${col.className || ''}`}
                                            >
                                                {col.render
                                                    ? col.render(item)
                                                    : String(item[col.key] ?? '')}
                                            </td>
                                        ))}
                                        {actionColumn && (
                                            <td className="px-4 py-3 text-sm">
                                                <div onClick={(e) => e.stopPropagation()}>
                                                    {actionColumn(item)}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                        {paginated.map((item, idx) => (
                            <div
                                key={idx}
                                className={`
                  bg-bg-card border border-border rounded-xl p-4 space-y-2
                  ${onRowClick ? 'cursor-pointer hover:border-teal/40' : ''}
                `}
                                onClick={() => onRowClick?.(item)}
                            >
                                {columns.map((col) => (
                                    <div key={col.key} className="flex justify-between items-start gap-2">
                                        <span className="text-xs font-medium text-text-light shrink-0">
                                            {col.header}
                                        </span>
                                        <span className="text-sm text-text-primary text-end">
                                            {col.render
                                                ? col.render(item)
                                                : String(item[col.key] ?? '')}
                                        </span>
                                    </div>
                                ))}
                                {actionColumn && (
                                    <div
                                        className="pt-2 border-t border-border"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {actionColumn(item)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-text-light">
                        {t.common.showing} {(currentPage - 1) * pageSize + 1}–
                        {Math.min(currentPage * pageSize, sorted.length)} {t.common.of}{' '}
                        {sorted.length} {t.common.results}
                    </p>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
