'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface PlatformSetting {
    key: string;
    value: string;
    description: string | null;
    updated_at: string;
}

const settingLabels: Record<string, { ar: string; en: string; type: 'text' | 'textarea' | 'toggle' }> = {
    announcement: { ar: 'إعلان المنصة', en: 'Platform Announcement', type: 'textarea' },
    maintenance_mode: { ar: 'وضع الصيانة', en: 'Maintenance Mode', type: 'toggle' },
    max_messages_per_day: { ar: 'الحد الأقصى للرسائل يومياً', en: 'Max Messages Per Day', type: 'text' },
    welcome_message: { ar: 'رسالة الترحيب', en: 'Welcome Message', type: 'textarea' },
    contact_email: { ar: 'بريد التواصل', en: 'Contact Email', type: 'text' },
    site_title_ar: { ar: 'عنوان الموقع (عربي)', en: 'Site Title (Arabic)', type: 'text' },
    site_title_en: { ar: 'عنوان الموقع (إنجليزي)', en: 'Site Title (English)', type: 'text' },
};

export default function AdminSettingsPage() {
    const { t, language } = useTranslation();
    const { isLoading: authLoading } = useAuth();
    const [settings, setSettings] = useState<PlatformSetting[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editValues, setEditValues] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState<string | null>(null);
    const [savedKey, setSavedKey] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/admin/settings')
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setSettings(data);
                    const vals: Record<string, string> = {};
                    data.forEach((s: PlatformSetting) => { vals[s.key] = s.value; });
                    setEditValues(vals);
                }
            })
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, []);

    const handleSave = async (key: string) => {
        setSaving(key);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value: editValues[key] || '' }),
            });
            if (res.ok) {
                setSavedKey(key);
                setTimeout(() => setSavedKey(null), 2000);
            }
        } catch { /* ignore */ }
        setSaving(null);
    };

    if (authLoading) return <LoadingSpinner fullScreen />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gradient-gold">{t.adminSettings.title}</h1>
                <p className="text-text-light text-sm mt-1">{t.adminSettings.subtitle}</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12"><LoadingSpinner /></div>
            ) : (
                <div className="space-y-4">
                    {settings.map((setting) => {
                        const meta = settingLabels[setting.key] || { ar: setting.key, en: setting.key, type: 'text' };
                        const isToggle = meta.type === 'toggle';
                        const isTextarea = meta.type === 'textarea';
                        const isSaved = savedKey === setting.key;

                        return (
                            <div key={setting.key} className="bg-bg-card shadow-sm border border-border-light rounded-xl p-5">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div>
                                        <h3 className="text-sm font-semibold text-text-primary">
                                            {language === 'ar' ? meta.ar : meta.en}
                                        </h3>
                                        {setting.description && (
                                            <p className="text-xs text-text-muted mt-0.5">{setting.description}</p>
                                        )}
                                    </div>
                                    {isSaved && (
                                        <span className="text-xs text-green-400 font-medium">✓ {t.common.success}</span>
                                    )}
                                </div>

                                {isToggle ? (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                const newVal = editValues[setting.key] === 'true' ? 'false' : 'true';
                                                setEditValues({ ...editValues, [setting.key]: newVal });
                                            }}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${editValues[setting.key] === 'true' ? 'bg-teal' : 'bg-bg-primary'} border border-border`}
                                        >
                                            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${editValues[setting.key] === 'true' ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                        </button>
                                        <span className="text-xs text-text-light">
                                            {editValues[setting.key] === 'true' ? (language === 'ar' ? 'مفعل' : 'Enabled') : (language === 'ar' ? 'معطل' : 'Disabled')}
                                        </span>
                                        <button
                                            onClick={() => handleSave(setting.key)}
                                            disabled={saving === setting.key}
                                            className="ms-auto text-xs bg-teal/10 text-teal px-3 py-1.5 rounded-lg hover:bg-teal/20 transition-colors disabled:opacity-50"
                                        >
                                            {saving === setting.key ? '...' : t.common.save}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        {isTextarea ? (
                                            <textarea
                                                rows={3}
                                                value={editValues[setting.key] || ''}
                                                onChange={(e) => setEditValues({ ...editValues, [setting.key]: e.target.value })}
                                                className="flex-1 bg-bg-secondary border border-border-light rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-teal/40 resize-none"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={editValues[setting.key] || ''}
                                                onChange={(e) => setEditValues({ ...editValues, [setting.key]: e.target.value })}
                                                className="flex-1 bg-bg-secondary border border-border-light rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-teal/40"
                                            />
                                        )}
                                        <button
                                            onClick={() => handleSave(setting.key)}
                                            disabled={saving === setting.key}
                                            className="text-xs bg-teal/10 text-teal px-4 py-2 rounded-lg hover:bg-teal/20 transition-colors disabled:opacity-50 flex-shrink-0"
                                        >
                                            {saving === setting.key ? '...' : t.common.save}
                                        </button>
                                    </div>
                                )}

                                <p className="text-[10px] text-text-muted mt-2">
                                    {language === 'ar' ? 'آخر تحديث' : 'Last updated'}: {new Date(setting.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
