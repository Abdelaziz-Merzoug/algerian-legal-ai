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

// POST /api/admin/laws/bulk-delete
export async function POST(req: NextRequest) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json({ error: 'No law IDs provided' }, { status: 400 });
    }

    // Delete associated document_sections (embeddings) first
    await admin.adminSupabase.from('document_sections').delete().in('document_id', ids);
    // Delete the laws
    const { error } = await admin.adminSupabase.from('legal_documents').delete().in('id', ids);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await admin.adminSupabase.from('audit_log').insert({
        admin_id: admin.adminId,
        action: 'bulk_delete_laws',
        target_type: 'law',
        details: { count: ids.length },
    });

    return NextResponse.json({ success: true, deleted: ids.length });
}
