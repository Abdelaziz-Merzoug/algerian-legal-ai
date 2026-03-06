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

// PATCH /api/admin/laws/[id] — edit a law
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { id } = await params;
    const updates = await req.json();

    const { error } = await admin.adminSupabase
        .from('legal_documents')
        .update(updates)
        .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await admin.adminSupabase.from('audit_log').insert({
        admin_id: admin.adminId,
        action: 'edit_law',
        target_type: 'law',
        target_id: id,
        details: { fields: Object.keys(updates) },
    });

    return NextResponse.json({ success: true });
}

// DELETE /api/admin/laws/[id] — delete a single law
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { id } = await params;

    // Delete associated sections first
    await admin.adminSupabase.from('document_sections').delete().eq('document_id', id);
    const { error } = await admin.adminSupabase.from('legal_documents').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await admin.adminSupabase.from('audit_log').insert({
        admin_id: admin.adminId,
        action: 'delete_law',
        target_type: 'law',
        target_id: id,
    });

    return NextResponse.json({ success: true });
}
