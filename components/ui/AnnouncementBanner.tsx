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
                <span className="text-teal me-2">📢</span>
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
