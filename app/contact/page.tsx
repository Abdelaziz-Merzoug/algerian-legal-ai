'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function ContactPage() {
    const { t, language } = useTranslation();
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setSent(true);
                setForm({ name: '', email: '', subject: '', message: '' });
            }
        } catch { /* ignore */ }
        setIsSending(false);
    };

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar />
            <main className="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4 text-teal">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-3">{t.contact.title}</h1>
                    <p className="text-text-light text-sm">{t.contact.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Contact form */}
                    <div className="md:col-span-2">
                        {sent ? (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
                                <div className="flex items-center justify-center mb-3 text-green-500">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="text-green-300 font-medium">{t.contact.messageSent}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder={t.contact.namePlaceholder}
                                        className="bg-bg-card shadow-sm border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-teal/40 transition-colors"
                                    />
                                    <input
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder={t.contact.emailPlaceholder}
                                        className="bg-bg-card shadow-sm border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-teal/40 transition-colors"
                                    />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    placeholder={t.contact.subjectPlaceholder}
                                    className="w-full bg-bg-card shadow-sm border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-teal/40 transition-colors"
                                />
                                <textarea
                                    required
                                    rows={6}
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    placeholder={t.contact.messagePlaceholder}
                                    className="w-full bg-bg-card shadow-sm border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-teal/40 transition-colors resize-none"
                                />
                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className="bg-teal hover:bg-teal-light text-navy font-bold px-8 py-3 rounded-xl transition-colors text-sm disabled:opacity-50"
                                >
                                    {isSending ? t.common.loading : t.contact.sendMessage}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact info sidebar */}
                    <div className="space-y-5">
                        <div className="bg-bg-card shadow-sm border border-border-light rounded-xl p-5">
                            <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-teal shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {t.contact.workingHours}
                            </h3>
                            <p className="text-xs text-text-light">{t.contact.workingHoursValue}</p>
                        </div>

                        <div className="bg-bg-card shadow-sm border border-border-light rounded-xl p-5">
                            <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-teal shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                {t.contact.emailAddress}
                            </h3>
                            <p className="text-xs text-text-light">contact@legal-ai.dz</p>
                        </div>

                        <div className="bg-bg-card shadow-sm border border-border-light rounded-xl p-5 text-center">
                            <div className="flex items-center justify-center mb-2">
                                <svg className="w-10 h-10 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="text-xs text-text-light">
                                {language === 'ar' ? 'الجزائر العاصمة، الجزائر' : 'Algiers, Algeria'}
                            </p>
                        </div>

                        <a
                            href="/faq"
                            className="block bg-teal-light border border-teal/20 rounded-xl p-4 text-center hover:bg-teal/15 transition-colors"
                        >
                            <span className="text-sm text-teal font-medium">{t.faq.title}</span>
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
