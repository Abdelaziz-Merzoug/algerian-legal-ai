'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Law {
    id: string;
    title: string;
    description: string | null;
    category_id: string;
    document_type: string;
    status: string;
    created_at: string;
    publication_date: string | null;
    category?: { name: string };
}

interface Category {
    id: string;
    name: string;
}

export default function AdminLawsPage() {
    const { t, language } = useTranslation();
    const [laws, setLaws] = useState<Law[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [actionMenuId, setActionMenuId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Import modal
    const [importOpen, setImportOpen] = useState(false);
    const [importData, setImportData] = useState<Record<string, string>[]>([]);
    const [importResult, setImportResult] = useState<{ imported: number; errors: { row: number; error: string }[] } | null>(null);

    // Add/Edit modal
    const [editOpen, setEditOpen] = useState(false);
    const [editLaw, setEditLaw] = useState<Partial<Law> | null>(null);

    const fetchLaws = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/laws');
            const data = await res.json();
            setLaws(data.laws || data || []);
        } catch { /* empty */ }
        finally { setLoading(false); }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data.categories || data || []);
        } catch { /* empty */ }
    }, []);

    useEffect(() => { fetchLaws(); fetchCategories(); }, [fetchLaws, fetchCategories]);

    // Filtered laws
    const filteredLaws = laws.filter(l => {
        const matchesSearch = !searchQuery ||
            l.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
        const matchesCat = categoryFilter === 'all' || l.category_id === categoryFilter;
        return matchesSearch && matchesStatus && matchesCat;
    });

    const toggleSelect = (id: string) => {
        const s = new Set(selectedIds);
        if (s.has(id)) s.delete(id); else s.add(id);
        setSelectedIds(s);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredLaws.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(filteredLaws.map(l => l.id)));
    };

    // File upload handler
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const ext = file.name.split('.').pop()?.toLowerCase();

        if (ext === 'csv') {
            const text = await file.text();
            const lines = text.split('\n').filter(l => l.trim());
            if (lines.length < 2) return;
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            const rows = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                const row: Record<string, string> = {};
                headers.forEach((h, i) => { row[h] = values[i] || ''; });
                return row;
            });
            setImportData(rows);
            setImportOpen(true);
            setImportResult(null);
        } else if (ext === 'xlsx' || ext === 'xls') {
            // Dynamically import xlsx
            const XLSX = (await import('xlsx')).default;
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);
            setImportData(rows);
            setImportOpen(true);
            setImportResult(null);
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleImport = async () => {
        if (!importData.length) return;
        setActionLoading('import');

        // Map import data to expected format
        const lawsToImport = importData.map(row => ({
            title: row.title || row.Title || row['عنوان'] || '',
            description: row.description || row.Description || row['وصف'] || '',
            content: row.content || row.Content || row['محتوى'] || '',
            category_id: row.category_id || row.Category_ID || categories[0]?.id || '',
            document_type: row.document_type || row.Type || 'law',
            publication_date: row.publication_date || row.Date || null,
            source_url: row.source_url || row.URL || null,
        }));

        const res = await fetch('/api/admin/laws/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ laws: lawsToImport }),
        });
        const result = await res.json();
        setImportResult(result);
        if (result.imported > 0) await fetchLaws();
        setActionLoading(null);
    };

    // Individual actions
    const handleDelete = async (id: string) => {
        if (!confirm(language === 'ar' ? 'حذف هذا القانون؟' : 'Delete this law?')) return;
        setActionLoading(id);
        await fetch(`/api/admin/laws/${id}`, { method: 'DELETE' });
        await fetchLaws();
        setActionLoading(null);
        setActionMenuId(null);
    };

    const handleStatusChange = async (id: string, status: string) => {
        setActionLoading(id);
        await fetch(`/api/admin/laws/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        await fetchLaws();
        setActionLoading(null);
        setActionMenuId(null);
    };

    const handleSaveLaw = async () => {
        if (!editLaw) return;
        setActionLoading('save');

        if (editLaw.id) {
            // Edit existing
            await fetch(`/api/admin/laws/${editLaw.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editLaw.title,
                    description: editLaw.description,
                    category_id: editLaw.category_id,
                    document_type: editLaw.document_type,
                }),
            });
        } else {
            // Add new via import API with single item
            await fetch('/api/admin/laws/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ laws: [editLaw] }),
            });
        }

        await fetchLaws();
        setEditOpen(false);
        setEditLaw(null);
        setActionLoading(null);
    };

    // Bulk actions
    const handleBulkDelete = async () => {
        if (!confirm(language === 'ar' ? `حذف ${selectedIds.size} قانون؟` : `Delete ${selectedIds.size} laws?`)) return;
        setActionLoading('bulk');
        await fetch('/api/admin/laws/bulk-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: Array.from(selectedIds) }),
        });
        setSelectedIds(new Set());
        await fetchLaws();
        setActionLoading(null);
    };

    const handleBulkStatus = async (status: string) => {
        setActionLoading('bulk');
        await fetch('/api/admin/laws/bulk-status', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: Array.from(selectedIds), status }),
        });
        setSelectedIds(new Set());
        await fetchLaws();
        setActionLoading(null);
    };

    const statusBadge = (status: string) => {
        const map: Record<string, 'success' | 'warning' | 'default'> = {
            active: 'success', pending: 'warning', archived: 'default',
        };
        return <Badge variant={map[status] || 'default'}>{status}</Badge>;
    };

    if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">{t.admin.laws}</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        {filteredLaws.length} {language === 'ar' ? 'قانون' : 'laws'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />
                    <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                        <svg className="w-4 h-4 me-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        {language === 'ar' ? 'استيراد CSV/Excel' : 'Import CSV/Excel'}
                    </Button>
                    <Button variant="primary" onClick={() => { setEditLaw({ title: '', description: '', category_id: categories[0]?.id || '', document_type: 'law' }); setEditOpen(true); }}>
                        <svg className="w-4 h-4 me-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                        {language === 'ar' ? 'إضافة قانون' : 'Add Law'}
                    </Button>
                </div>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <Input
                        placeholder={language === 'ar' ? 'بحث في القوانين...' : 'Search laws...'}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        icon={<svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-4 py-3 min-h-[44px] bg-bg-card border border-border rounded-xl text-sm text-text-primary"
                >
                    <option value="all">{language === 'ar' ? 'كل الحالات' : 'All Statuses'}</option>
                    <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
                    <option value="pending">{language === 'ar' ? 'معلق' : 'Pending'}</option>
                    <option value="archived">{language === 'ar' ? 'مؤرشف' : 'Archived'}</option>
                </select>
                <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="px-4 py-3 min-h-[44px] bg-bg-card border border-border rounded-xl text-sm text-text-primary"
                >
                    <option value="all">{language === 'ar' ? 'كل التصنيفات' : 'All Categories'}</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Bulk actions */}
            {selectedIds.size > 0 && (
                <div className="flex items-center flex-wrap gap-3 p-3 bg-teal-light border border-teal/20 rounded-xl">
                    <span className="text-sm font-medium text-teal">{selectedIds.size} {language === 'ar' ? 'محدد' : 'selected'}</span>
                    <Button variant="danger" size="sm" onClick={handleBulkDelete} isLoading={actionLoading === 'bulk'}>
                        {language === 'ar' ? 'حذف' : 'Delete'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleBulkStatus('active')}>
                        {language === 'ar' ? 'تفعيل' : 'Activate'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleBulkStatus('archived')}>
                        {language === 'ar' ? 'أرشفة' : 'Archive'}
                    </Button>
                </div>
            )}

            {/* Laws table */}
            <div className="bg-white border border-border-light rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border-light bg-bg-secondary">
                                <th className="px-4 py-3 text-start">
                                    <input type="checkbox" checked={selectedIds.size === filteredLaws.length && filteredLaws.length > 0} onChange={toggleSelectAll} className="rounded" />
                                </th>
                                <th className="px-4 py-3 text-start text-xs font-semibold text-text-secondary uppercase">{language === 'ar' ? 'العنوان' : 'Title'}</th>
                                <th className="px-4 py-3 text-start text-xs font-semibold text-text-secondary uppercase">{language === 'ar' ? 'التصنيف' : 'Category'}</th>
                                <th className="px-4 py-3 text-start text-xs font-semibold text-text-secondary uppercase">{language === 'ar' ? 'النوع' : 'Type'}</th>
                                <th className="px-4 py-3 text-start text-xs font-semibold text-text-secondary uppercase">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                                <th className="px-4 py-3 text-start text-xs font-semibold text-text-secondary uppercase">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                                <th className="px-4 py-3 text-start text-xs font-semibold text-text-secondary uppercase">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light">
                            {filteredLaws.map(law => (
                                <tr key={law.id} className="hover:bg-bg-secondary transition-colors">
                                    <td className="px-4 py-3">
                                        <input type="checkbox" checked={selectedIds.has(law.id)} onChange={() => toggleSelect(law.id)} className="rounded" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-medium text-text-primary truncate max-w-xs">{law.title}</p>
                                        {law.description && <p className="text-xs text-text-muted truncate max-w-xs">{law.description}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-text-secondary">{law.category?.name || '—'}</td>
                                    <td className="px-4 py-3"><Badge variant="default">{law.document_type}</Badge></td>
                                    <td className="px-4 py-3">{statusBadge(law.status)}</td>
                                    <td className="px-4 py-3 text-sm text-text-muted">
                                        {law.publication_date ? new Date(law.publication_date).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'en-US') : '—'}
                                    </td>
                                    <td className="px-4 py-3 relative">
                                        <button
                                            onClick={() => setActionMenuId(actionMenuId === law.id ? null : law.id)}
                                            className="p-2 rounded-lg hover:bg-bg-card text-text-secondary transition-colors"
                                            disabled={actionLoading === law.id}
                                        >
                                            {actionLoading === law.id ? <LoadingSpinner /> : '⋮'}
                                        </button>
                                        {actionMenuId === law.id && (
                                            <div className="absolute end-4 top-full mt-1 z-20 bg-white border border-border rounded-xl shadow-lg py-1 min-w-[180px]">
                                                <button onClick={() => { setEditLaw(law); setEditOpen(true); setActionMenuId(null); }} className="w-full text-start px-4 py-2 text-sm hover:bg-bg-secondary transition-colors flex items-center gap-2">
                                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    {language === 'ar' ? 'تعديل' : 'Edit'}
                                                </button>
                                                {law.status !== 'active' && (
                                                    <button onClick={() => handleStatusChange(law.id, 'active')} className="w-full text-start px-4 py-2 text-sm hover:bg-bg-secondary transition-colors flex items-center gap-2">
                                                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                                                        {language === 'ar' ? 'تفعيل' : 'Activate'}
                                                    </button>
                                                )}
                                                {law.status !== 'archived' && (
                                                    <button onClick={() => handleStatusChange(law.id, 'archived')} className="w-full text-start px-4 py-2 text-sm hover:bg-bg-secondary transition-colors flex items-center gap-2">
                                                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                                        {language === 'ar' ? 'أرشفة' : 'Archive'}
                                                    </button>
                                                )}
                                                <div className="border-t border-border-light my-1" />
                                                <button onClick={() => handleDelete(law.id)} className="w-full text-start px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors flex items-center gap-2">
                                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    {language === 'ar' ? 'حذف' : 'Delete'}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredLaws.length === 0 && (
                    <div className="text-center py-12 text-text-muted">
                        {language === 'ar' ? 'لا يوجد قوانين' : 'No laws found'}
                    </div>
                )}
            </div>

            {/* Close action menu */}
            {actionMenuId && <div className="fixed inset-0 z-10" onClick={() => setActionMenuId(null)} />}

            {/* Import Preview Modal */}
            {importOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-xl space-y-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-text-primary">
                                {language === 'ar' ? 'معاينة الاستيراد' : 'Import Preview'}
                            </h2>
                            <button onClick={() => setImportOpen(false)} className="text-text-muted hover:text-text-primary p-1">✕</button>
                        </div>

                        {importResult ? (
                            <div className="space-y-3">
                                <div className={`p-4 rounded-xl text-sm ${importResult.imported > 0 ? 'bg-success/10 border border-success/20' : 'bg-error/10 border border-error/20'}`}>
                                    <p className="font-semibold">{importResult.imported} {language === 'ar' ? 'تم استيرادها بنجاح' : 'imported successfully'}</p>
                                    {importResult.errors.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-error font-medium">{importResult.errors.length} {language === 'ar' ? 'أخطاء' : 'errors'}:</p>
                                            {importResult.errors.slice(0, 5).map((e, i) => (
                                                <p key={i} className="text-xs text-error">Row {e.row}: {e.error}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <Button variant="primary" fullWidth onClick={() => setImportOpen(false)}>
                                    {language === 'ar' ? 'إغلاق' : 'Close'}
                                </Button>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-text-secondary">
                                    {importData.length} {language === 'ar' ? 'سجل جاهز للاستيراد' : 'records ready to import'}
                                </p>
                                {importData.length > 0 && (
                                    <div className="overflow-x-auto max-h-[300px] border border-border-light rounded-lg">
                                        <table className="w-full text-xs">
                                            <thead className="bg-bg-secondary sticky top-0">
                                                <tr>
                                                    {Object.keys(importData[0]).slice(0, 5).map(k => (
                                                        <th key={k} className="px-3 py-2 text-start font-medium text-text-secondary">{k}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border-light">
                                                {importData.slice(0, 10).map((row, i) => (
                                                    <tr key={i}>
                                                        {Object.values(row).slice(0, 5).map((v, j) => (
                                                            <td key={j} className="px-3 py-2 text-text-primary truncate max-w-[150px]">{String(v)}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <Button variant="ghost" fullWidth onClick={() => setImportOpen(false)}>{t.common.cancel}</Button>
                                    <Button variant="primary" fullWidth onClick={handleImport} isLoading={actionLoading === 'import'}>
                                        {language === 'ar' ? `استيراد ${importData.length} قانون` : `Import ${importData.length} Laws`}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Add/Edit Law Modal */}
            {editOpen && editLaw && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-text-primary">
                                {editLaw.id ? (language === 'ar' ? 'تعديل القانون' : 'Edit Law') : (language === 'ar' ? 'إضافة قانون جديد' : 'Add New Law')}
                            </h2>
                            <button onClick={() => { setEditOpen(false); setEditLaw(null); }} className="text-text-muted hover:text-text-primary p-1">✕</button>
                        </div>
                        <Input
                            label={language === 'ar' ? 'العنوان' : 'Title'}
                            value={editLaw.title || ''}
                            onChange={e => setEditLaw({ ...editLaw, title: e.target.value })}
                        />
                        <Input
                            label={language === 'ar' ? 'الوصف' : 'Description'}
                            value={editLaw.description || ''}
                            onChange={e => setEditLaw({ ...editLaw, description: e.target.value })}
                        />
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-text-secondary">{language === 'ar' ? 'التصنيف' : 'Category'}</label>
                            <select
                                value={editLaw.category_id || ''}
                                onChange={e => setEditLaw({ ...editLaw, category_id: e.target.value })}
                                className="w-full px-4 py-3 min-h-[44px] bg-bg-card border border-border rounded-xl text-base text-text-primary"
                            >
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-text-secondary">{language === 'ar' ? 'نوع الوثيقة' : 'Type'}</label>
                            <select
                                value={editLaw.document_type || 'law'}
                                onChange={e => setEditLaw({ ...editLaw, document_type: e.target.value })}
                                className="w-full px-4 py-3 min-h-[44px] bg-bg-card border border-border rounded-xl text-base text-text-primary"
                            >
                                <option value="law">{language === 'ar' ? 'قانون' : 'Law'}</option>
                                <option value="decree">{language === 'ar' ? 'مرسوم' : 'Decree'}</option>
                                <option value="order">{language === 'ar' ? 'أمر' : 'Order'}</option>
                                <option value="regulation">{language === 'ar' ? 'لائحة' : 'Regulation'}</option>
                            </select>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="ghost" fullWidth onClick={() => { setEditOpen(false); setEditLaw(null); }}>
                                {t.common.cancel}
                            </Button>
                            <Button variant="primary" fullWidth onClick={handleSaveLaw} isLoading={actionLoading === 'save'}>
                                {editLaw.id ? (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes') : (language === 'ar' ? 'إضافة' : 'Add')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
