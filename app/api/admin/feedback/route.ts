import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

async function getAdminSupabase() {
    const cookieStore = await cookies();
    const authSupabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll() } }
    );
    const { data: { user } } = await authSupabase.auth.getUser();
    if (!user) return null;

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    return profile?.role === 'admin' ? supabase : null;
}

// GET /api/admin/feedback — get all feedback with user info
export async function GET() {
    const supabase = await getAdminSupabase();
    if (!supabase) return NextResponse.json([], { status: 401 });

    const { data } = await supabase
        .from('feedback')
        .select('id, subject, message, type, status, rating, priority, admin_response, created_at, profiles(username, email)')
        .order('created_at', { ascending: false });

    return NextResponse.json(data || []);
}

// PUT /api/admin/feedback — update feedback status, priority, or respond
export async function PUT(request: NextRequest) {
    const supabase = await getAdminSupabase();
    if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, status, priority, admin_response } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (admin_response !== undefined) updates.admin_response = admin_response;

    const { error } = await supabase.from('feedback').update(updates).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
