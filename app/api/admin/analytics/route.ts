import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// GET /api/admin/analytics — returns analytics data for admin dashboard
export async function GET() {
    try {
        const cookieStore = await cookies();
        const authSupabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll: () => cookieStore.getAll() } }
        );
        const { data: { user } } = await authSupabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Verify admin
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        // Gather analytics
        const [
            usersResult,
            documentsResult,
            articlesResult,
            conversationsResult,
            messagesResult,
            feedbackResult,
            contactResult,
            recentUsers,
            feedbackByType,
            recentFeedback,
        ] = await Promise.all([
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('legal_documents').select('*', { count: 'exact', head: true }).eq('status', 'active'),
            supabase.from('legal_articles').select('*', { count: 'exact', head: true }).eq('is_active', true),
            supabase.from('conversations').select('*', { count: 'exact', head: true }),
            supabase.from('messages').select('*', { count: 'exact', head: true }),
            supabase.from('feedback').select('*', { count: 'exact', head: true }),
            supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('id, username, email, created_at').order('created_at', { ascending: false }).limit(5),
            supabase.from('feedback').select('type'),
            supabase.from('feedback').select('id, subject, type, status, rating, created_at, profiles(username)').order('created_at', { ascending: false }).limit(5),
        ]);

        // Count feedback by type
        const typeCounts: Record<string, number> = {};
        (feedbackByType.data || []).forEach((f: { type: string }) => {
            typeCounts[f.type] = (typeCounts[f.type] || 0) + 1;
        });

        // Get daily conversation counts (last 7 days)
        const dailyStats = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
            const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString();

            const { count } = await supabase.from('conversations')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', dayStart)
                .lt('created_at', dayEnd);

            dailyStats.push({
                label: date.toLocaleDateString('en-US', { weekday: 'short' }),
                value: count || 0,
            });
        }

        return NextResponse.json({
            totals: {
                users: usersResult.count || 0,
                documents: documentsResult.count || 0,
                articles: articlesResult.count || 0,
                conversations: conversationsResult.count || 0,
                messages: messagesResult.count || 0,
                feedback: feedbackResult.count || 0,
                contacts: contactResult.count || 0,
            },
            dailyStats,
            feedbackByType: typeCounts,
            recentUsers: recentUsers.data || [],
            recentFeedback: recentFeedback.data || [],
        });
    } catch (error) {
        console.error('Analytics API error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
