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

// PATCH /api/admin/users/[id] — edit user profile
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const { username, email, role } = body;

    const updates: Record<string, string> = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (role && (role === 'admin' || role === 'user')) updates.role = role;

    const { error } = await admin.adminSupabase
        .from('profiles')
        .update(updates)
        .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Log audit
    await admin.adminSupabase.from('audit_log').insert({
        admin_id: admin.adminId,
        action: 'edit_user',
        target_type: 'user',
        target_id: id,
        details: updates,
    });

    return NextResponse.json({ success: true });
}

// DELETE /api/admin/users/[id] — delete user completely
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { id } = await params;

    // Don't allow self-delete
    if (id === admin.adminId) {
        return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    // Delete in order: messages → conversations → feedback → profile → auth user
    await admin.adminSupabase.from('messages').delete().in(
        'conversation_id',
        (await admin.adminSupabase.from('conversations').select('id').eq('user_id', id)).data?.map(c => c.id) || []
    );
    await admin.adminSupabase.from('conversations').delete().eq('user_id', id);
    await admin.adminSupabase.from('feedback').delete().eq('user_id', id);
    await admin.adminSupabase.from('profiles').delete().eq('id', id);

    // Delete from auth.users
    const { error } = await admin.adminSupabase.auth.admin.deleteUser(id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Log audit
    await admin.adminSupabase.from('audit_log').insert({
        admin_id: admin.adminId,
        action: 'delete_user',
        target_type: 'user',
        target_id: id,
    });

    return NextResponse.json({ success: true });
}
