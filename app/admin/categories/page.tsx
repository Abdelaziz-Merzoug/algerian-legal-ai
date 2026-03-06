'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Category {
    id: string;
    name: string;
    name_ar?: string;
    name_en?: string;
    description: string;
    description_ar?: string;
    description_en?: string;
    icon: string;
    display_order?: number;
    document_count?: number;
}

export default function AdminCategoriesPage() {
    const { t, language } = useTranslation();
    const toast = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    const [form, setForm] = useState({
        name_ar: '', name_en: '', description_ar: '', description_en: '', icon: '📄', display_order: 0,
    });

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch { /* empty */ }
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const openAdd = () => {
        setEditingCategory(null);
        setForm({ name_ar: '', name_en: '', description_ar: '', description_en: '', icon: '📄', display_order: categories.length });
        setModalOpen(true);
    };

    const openEdit = (cat: Category) => {
        setEditingCategory(cat);
        setForm({
            name_ar: cat.name_ar || cat.name || '',
            name_en: cat.name_en || '',
            description_ar: cat.description_ar || cat.description || '',
            description_en: cat.description_en || '',
            icon: cat.icon || '📄',
            display_order: cat.display_order || 0,
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.name_ar || !form.name_en) { toast.error(t.errors.required); return; }
        setIsSaving(true);
        try {
            const method = editingCategory ? 'PUT' : 'POST';
            const body = editingCategory ? { id: editingCategory.id, ...form } : form;
            const res = await fetch('/api/admin/categories', {
                method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
            });
            if (res.ok) {
                toast.success(t.common.success);
                setModalOpen(false);
                fetchCategories();
            } else {
                const data = await res.json();
                toast.error(data.error || t.errors.serverError);
            }
        } catch { toast.error(t.errors.serverError); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (cat: Category) => {
        // Protection: check if category has documents
        if (cat.document_count && cat.document_count > 0) {
            toast.error(
                language === 'ar'
                    ? `لا يمكن حذف هذا التصنيف لأنه يحتوي على ${cat.document_count} وثيقة`
                    : `Cannot delete this category because it has ${cat.document_count} documents`
            );
            return;
        }

        if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا التصنيف؟' : 'Are you sure you want to delete this category?')) return;

        setDeleteLoading(cat.id);
        try {
            const res = await fetch(`/api/admin/categories?id=${cat.id}`, { method: 'DELETE' });
            if (res.ok) { toast.success(t.common.success); fetchCategories(); }
            else {
                const data = await res.json();
                toast.error(data.error || t.errors.serverError);
            }
        } catch { toast.error(t.errors.serverError); }
        finally { setDeleteLoading(null); }
    };

    const moveCategory = async (cat: Category, direction: 'up' | 'down') => {
        const sorted = [...categories].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        const idx = sorted.findIndex(c => c.id === cat.id);
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= sorted.length) return;

        // Swap display_order
        const updates = [
            { id: sorted[idx].id, display_order: sorted[swapIdx].display_order || swapIdx },
            { id: sorted[swapIdx].id, display_order: sorted[idx].display_order || idx },
        ];

        for (const update of updates) {
            await fetch('/api/admin/categories', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(update),
            });
        }
        fetchCategories();
    };

    if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

    const sortedCategories = [...categories].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">{t.admin.categories}</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        {categories.length} {language === 'ar' ? 'تصنيف' : 'categories'}
                    </p>
                </div>
                <Button size="sm" onClick={openAdd}>➕ {t.admin.addCategory}</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCategories.map((cat, idx) => (
                    <Card key={cat.id} padding="md" hover>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-3xl">{cat.icon}</span>
                                {cat.display_order !== undefined && (
                                    <span className="text-xs text-text-muted bg-bg-secondary px-2 py-0.5 rounded">#{idx + 1}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-0.5">
                                <button
                                    onClick={() => moveCategory(cat, 'up')}
                                    disabled={idx === 0}
                                    className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-muted hover:text-teal transition-colors disabled:opacity-30"
                                    title={language === 'ar' ? 'نقل لأعلى' : 'Move Up'}
                                >▲</button>
                                <button
                                    onClick={() => moveCategory(cat, 'down')}
                                    disabled={idx === sortedCategories.length - 1}
                                    className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-muted hover:text-teal transition-colors disabled:opacity-30"
                                    title={language === 'ar' ? 'نقل لأسفل' : 'Move Down'}
                                >▼</button>
                                <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-muted hover:text-teal transition-colors">✏️</button>
                                <button
                                    onClick={() => handleDelete(cat)}
                                    disabled={deleteLoading === cat.id}
                                    className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-muted hover:text-error transition-colors"
                                >
                                    {deleteLoading === cat.id ? '⏳' : '🗑️'}
                                </button>
                            </div>
                        </div>
                        <h3 className="font-bold text-text-primary">{language === 'ar' ? (cat.name_ar || cat.name) : (cat.name_en || cat.name)}</h3>
                        <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                            {language === 'ar' ? (cat.description_ar || cat.description) : (cat.description_en || cat.description)}
                        </p>
                        {cat.document_count !== undefined && cat.document_count > 0 && (
                            <div className="mt-3">
                                <Badge variant="gold">
                                    📄 {cat.document_count} {language === 'ar' ? 'وثيقة' : 'documents'}
                                </Badge>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-12 text-text-muted">{t.admin.noDocuments}</div>
            )}

            {/* Add/Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCategory ? t.admin.editCategory : t.admin.addCategory} maxWidth="lg">
                <div className="space-y-4">
                    <Input label={language === 'ar' ? 'الأيقونة' : 'Icon'} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="📄" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input label={language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'} value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} placeholder="اسم التصنيف" />
                        <Input label={language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'} value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} placeholder="Category name" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input label={language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'} value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} placeholder="وصف التصنيف" />
                        <Input label={language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} placeholder="Category description" />
                    </div>
                    <Input
                        label={language === 'ar' ? 'ترتيب العرض' : 'Display Order'}
                        type="number" value={String(form.display_order)}
                        onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                    />
                    <div className="flex gap-3 pt-2">
                        <Button variant="ghost" fullWidth onClick={() => setModalOpen(false)}>{t.common.cancel}</Button>
                        <Button fullWidth onClick={handleSave} isLoading={isSaving}>{t.common.save}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
