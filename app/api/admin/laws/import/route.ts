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

// POST /api/admin/laws/import — import laws from CSV/Excel data
export async function POST(req: NextRequest) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { laws } = await req.json();
    if (!laws || !Array.isArray(laws) || laws.length === 0) {
        return NextResponse.json({ error: 'No laws data provided' }, { status: 400 });
    }

    let imported = 0;
    const errors: { row: number; error: string }[] = [];

    for (let i = 0; i < laws.length; i++) {
        const law = laws[i];
        try {
            if (!law.title || !law.category_id) {
                errors.push({ row: i + 1, error: 'Missing title or category_id' });
                continue;
            }

            const { error } = await admin.adminSupabase.from('legal_documents').insert({
                title: law.title,
                description: law.description || null,
                content: law.content || null,
                category_id: law.category_id,
                document_type: law.document_type || 'law',
                source_url: law.source_url || null,
                publication_date: law.publication_date || null,
                status: 'pending',
            });

            if (error) {
                errors.push({ row: i + 1, error: error.message });
            } else {
                imported++;
            }
        } catch (err) {
            errors.push({ row: i + 1, error: String(err) });
        }
    }

    // Log audit
    await admin.adminSupabase.from('audit_log').insert({
        admin_id: admin.adminId,
        action: 'import_laws',
        target_type: 'law',
        details: { imported, errors: errors.length, total: laws.length },
    });

    return NextResponse.json({ success: true, imported, errors });
}
