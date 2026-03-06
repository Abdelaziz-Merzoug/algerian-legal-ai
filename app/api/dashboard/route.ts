import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// GET /api/dashboard — auth required, returns user dashboard data
export async function GET() {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll: () => cookieStore.getAll() } }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const adminSupabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Get profile
        const { data: profile } = await adminSupabase
            .from('profiles')
            .select('username, created_at')
            .eq('id', user.id)
            .single();

        // Get stats
        const [convResult, msgResult] = await Promise.all([
            adminSupabase.from('conversations').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
            adminSupabase.from('messages').select('*', { count: 'exact', head: true })
                .in('conversation_id',
                    (await adminSupabase.from('conversations').select('id').eq('user_id', user.id)).data?.map((c: { id: string }) => c.id) || []
                ),
        ]);

        // Get recent conversations
        const { data: recentConversations } = await adminSupabase
            .from('conversations')
            .select('id, title, created_at, updated_at')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(5);

        return NextResponse.json({
            username: profile?.username || user.email?.split('@')[0] || 'User',
            totalConversations: convResult.count || 0,
            totalMessages: msgResult.count || 0,
            memberSince: profile?.created_at || user.created_at,
            recentConversations: recentConversations || [],
        });
    } catch (error) {
        console.error('Dashboard API error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
