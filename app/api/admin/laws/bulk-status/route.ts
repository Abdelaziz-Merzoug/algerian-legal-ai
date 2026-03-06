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

// PATCH /api/admin/laws/bulk-status — change status for multiple laws
export async function PATCH(req: NextRequest) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { ids, status } = await req.json();
    if (!ids || !Array.isArray(ids) || !status) {
        return NextResponse.json({ error: 'Missing ids or status' }, { status: 400 });
    }

    const validStatuses = ['pending', 'active', 'archived'];
    if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { error } = await admin.adminSupabase
        .from('legal_documents')
        .update({ status })
        .in('id', ids);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await admin.adminSupabase.from('audit_log').insert({
        admin_id: admin.adminId,
        action: 'bulk_status_change_laws',
        target_type: 'law',
        details: { count: ids.length, new_status: status },
    });

    return NextResponse.json({ success: true });
}
