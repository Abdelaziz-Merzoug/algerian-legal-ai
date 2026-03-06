import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getSupabase() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch { }
                },
            },
        }
    );
}

// GET /api/profile — get user profile + stats
export async function GET() {
    try {
        const supabase = await getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Get profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        // Get stats
        const [conversationsRes, messagesRes] = await Promise.all([
            supabase
                .from('conversations')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', user.id),
            supabase
                .from('messages')
                .select('id, conversation_id', { count: 'exact', head: true })
                .in(
                    'conversation_id',
                    (
                        await supabase
                            .from('conversations')
                            .select('id')
                            .eq('user_id', user.id)
                    ).data?.map((c) => c.id) || []
                ),
        ]);

        return NextResponse.json({
            profile: profile || {
                id: user.id,
                email: user.email,
                username: user.user_metadata?.username || user.email?.split('@')[0],
                created_at: user.created_at,
            },
            stats: {
                totalConversations: conversationsRes.count || 0,
                totalMessages: messagesRes.count || 0,
            },
        });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// PUT /api/profile — update username
export async function PUT(request: NextRequest) {
    try {
        const supabase = await getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { username } = await request.json();

        if (!username || username.length < 3 || username.length > 30) {
            return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
        }

        const { error } = await supabase
            .from('profiles')
            .update({ username: username.trim() })
            .eq('id', user.id);

        if (error) throw error;

        // Also update auth metadata
        await supabase.auth.updateUser({
            data: { username: username.trim() },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
