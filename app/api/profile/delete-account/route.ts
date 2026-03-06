import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// POST /api/profile/delete-account — user deletes their own account
export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { confirmation } = await req.json();
    if (confirmation !== 'DELETE') {
        return NextResponse.json({ error: 'Confirmation required' }, { status: 400 });
    }

    // Use service role to delete all user data
    const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Cascade delete user data
    const { data: convs } = await adminSupabase
        .from('conversations').select('id').eq('user_id', user.id);
    const convIds = convs?.map(c => c.id) || [];

    if (convIds.length > 0) {
        await adminSupabase.from('messages').delete().in('conversation_id', convIds);
    }
    await adminSupabase.from('conversations').delete().eq('user_id', user.id);
    await adminSupabase.from('feedback').delete().eq('user_id', user.id);
    await adminSupabase.from('profiles').delete().eq('id', user.id);

    // Delete the auth user
    const { error } = await adminSupabase.auth.admin.deleteUser(user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
}
