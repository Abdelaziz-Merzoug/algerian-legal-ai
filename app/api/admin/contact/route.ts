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
        .from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return null;
    return { adminSupabase, adminId: user.id };
}

// GET /api/admin/contact — list contact messages
export async function GET(req: NextRequest) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;

    let query = admin.adminSupabase
        .from('contact_messages')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

    if (status !== 'all') query = query.eq('status', status);

    const { data, count, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ messages: data || [], total: count || 0, page, limit });
}

// PATCH /api/admin/contact — update message status
export async function PATCH(req: NextRequest) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { id, status, admin_note } = await req.json();
    if (!id) return NextResponse.json({ error: 'Message ID required' }, { status: 400 });

    const updates: Record<string, string> = {};
    if (status) updates.status = status;
    if (admin_note !== undefined) updates.admin_note = admin_note;

    const { error } = await admin.adminSupabase
        .from('contact_messages').update(updates).eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await admin.adminSupabase.from('audit_log').insert({
        admin_id: admin.adminId,
        action: 'update_contact_message',
        target_type: 'contact',
        target_id: id,
        details: updates,
    });

    return NextResponse.json({ success: true });
}

// DELETE /api/admin/contact — delete a contact message
export async function DELETE(req: NextRequest) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const { error } = await admin.adminSupabase
        .from('contact_messages').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
