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

// POST /api/admin/users/[id]/toggle — toggle active/inactive
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;

  // Get current status
  const { data: profile } = await admin.adminSupabase
    .from('profiles')
    .select('is_active')
    .eq('id', id)
    .single();

  if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const newStatus = !profile.is_active;

  const { error } = await admin.adminSupabase
    .from('profiles')
    .update({ is_active: newStatus })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log audit
  await admin.adminSupabase.from('audit_log').insert({
    admin_id: admin.adminId,
    action: newStatus ? 'activate_user' : 'deactivate_user',
    target_type: 'user',
    target_id: id,
  });

  return NextResponse.json({ success: true, is_active: newStatus });
}
