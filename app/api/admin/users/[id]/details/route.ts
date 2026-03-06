import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

async function verifyAdmin() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll() } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: profile } = await adminSupabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') return null;
    return { adminSupabase, adminId: user.id };
}

// GET /api/admin/users/[id]/details — get user details + stats
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { id } = await params;

    // Get profile
    const { data: profile } = await admin.adminSupabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Get stats in parallel
    const [convResult, fbResult, convList] = await Promise.all([
        admin.adminSupabase.from('conversations').select('id', { count: 'exact' }).eq('user_id', id),
        admin.adminSupabase.from('feedback').select('id', { count: 'exact' }).eq('user_id', id),
        admin.adminSupabase.from('conversations').select('id, title, created_at').eq('user_id', id).order('created_at', { ascending: false }).limit(10),
    ]);

    // Count messages from user's conversations (no RPC dependency)
    let messageCount = 0;
    const convIds = convResult.data?.map(c => c.id) || [];
    if (convIds.length > 0) {
        const { count } = await admin.adminSupabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .in('conversation_id', convIds);
        messageCount = count || 0;
    }

    return NextResponse.json({
        profile,
        stats: {
            conversations: convResult.count || 0,
            messages: messageCount,
            feedback: fbResult.count || 0,
        },
        recentConversations: convList.data || [],
    });
}
