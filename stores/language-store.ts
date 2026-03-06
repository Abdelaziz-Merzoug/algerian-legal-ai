'use client';

import { create } from 'zustand';

type Language = 'ar' | 'en';

interface LanguageState {
    language: Language;
    direction: 'rtl' | 'ltr';
    hydrated: boolean;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
    hydrate: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
    // Default values (match server render)
    language: 'ar',
    direction: 'rtl',
    hydrated: false,

    hydrate: () => {
        if (typeof window === 'undefined') return;
        const saved = localStorage.getItem('app-language') as Language | null;
        if (saved === 'ar' || saved === 'en') {
            document.documentElement.lang = saved;
            document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
            set({
                language: saved,
                direction: saved === 'ar' ? 'rtl' : 'ltr',
                hydrated: true,
            });
        } else {
            set({ hydrated: true });
        }
    },

    setLanguage: (lang: Language) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('app-language', lang);
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        }
        set({
            language: lang,
            direction: lang === 'ar' ? 'rtl' : 'ltr',
        });
    },

    toggleLanguage: () => {
        set((state) => {
            const newLang: Language = state.language === 'ar' ? 'en' : 'ar';
            if (typeof window !== 'undefined') {
                localStorage.setItem('app-language', newLang);
                document.documentElement.lang = newLang;
                document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
            }
            return {
                language: newLang,
                direction: newLang === 'ar' ? 'rtl' : 'ltr',
            };
        });
    },
}));
