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

// DELETE /api/admin/users/bulk — bulk delete users
export async function DELETE(req: NextRequest) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json({ error: 'No user IDs provided' }, { status: 400 });
    }

    // Filter out admin's own ID
    const safeIds = ids.filter((id: string) => id !== admin.adminId);

    let deleted = 0;
    for (const id of safeIds) {
        try {
            // Delete messages from user's conversations
            const { data: convs } = await admin.adminSupabase
                .from('conversations').select('id').eq('user_id', id);
            const convIds = convs?.map(c => c.id) || [];
            if (convIds.length > 0) {
                await admin.adminSupabase.from('messages').delete().in('conversation_id', convIds);
            }
            await admin.adminSupabase.from('conversations').delete().eq('user_id', id);
            await admin.adminSupabase.from('feedback').delete().eq('user_id', id);
            await admin.adminSupabase.from('profiles').delete().eq('id', id);
            await admin.adminSupabase.auth.admin.deleteUser(id);
            deleted++;
        } catch {
            // Continue with next user
        }
    }

    // Log audit
    await admin.adminSupabase.from('audit_log').insert({
        admin_id: admin.adminId,
        action: 'bulk_delete_users',
        target_type: 'user',
        details: { count: deleted, ids: safeIds },
    });

    return NextResponse.json({ success: true, deleted });
}

// PATCH /api/admin/users/bulk — bulk status change
export async function PATCH(req: NextRequest) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { ids, is_active } = await req.json();
    if (!ids || !Array.isArray(ids)) {
        return NextResponse.json({ error: 'No user IDs provided' }, { status: 400 });
    }

    const { error } = await admin.adminSupabase
        .from('profiles')
        .update({ is_active })
        .in('id', ids);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Log audit
    await admin.adminSupabase.from('audit_log').insert({
        admin_id: admin.adminId,
        action: is_active ? 'bulk_activate_users' : 'bulk_deactivate_users',
        target_type: 'user',
        details: { count: ids.length, ids },
    });

    return NextResponse.json({ success: true });
}
