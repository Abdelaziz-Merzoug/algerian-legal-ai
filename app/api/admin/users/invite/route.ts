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

// POST /api/admin/users/invite — invite/create a new user
export async function POST(req: NextRequest) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { email, username } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    // Generate a temporary password
    const tempPassword = `Temp${Date.now().toString(36)}!`;

    // Create user via admin API
    const { data: newUser, error } = await admin.adminSupabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { username: username || email.split('@')[0] },
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Create profile
    if (newUser?.user) {
        await admin.adminSupabase.from('profiles').upsert({
            id: newUser.user.id,
            username: username || email.split('@')[0],
            email,
            role: 'user',
            is_active: true,
        });
    }

    // Log audit
    await admin.adminSupabase.from('audit_log').insert({
        admin_id: admin.adminId,
        action: 'invite_user',
        target_type: 'user',
        target_id: newUser?.user?.id,
        details: { email, username },
    });

    return NextResponse.json({
        success: true,
        user: { id: newUser?.user?.id, email },
        tempPassword,
    });
}
