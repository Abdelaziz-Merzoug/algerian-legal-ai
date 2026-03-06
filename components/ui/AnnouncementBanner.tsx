'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function AnnouncementBanner() {
    const [announcement, setAnnouncement] = useState('');
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        supabase
            .from('platform_settings')
            .select('value')
            .eq('key', 'announcement')
            .single()
            .then(({ data }) => {
                if (data?.value && data.value.trim()) {
                    setAnnouncement(data.value);
                }
            });
    }, []);

    if (!announcement || !isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border-b border-teal/30 relative">
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center">
                <svg className="w-4 h-4 text-teal me-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                <p className="text-sm text-teal font-medium text-center">{announcement}</p>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-teal/60 hover:text-teal text-lg transition-colors"
                >
                    ×
                </button>
            </div>
        </div>
    );
}
