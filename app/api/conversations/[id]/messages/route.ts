import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// GET /api/conversations/[id]/messages — get messages for a conversation
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const supabase = createServerClient(
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

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Verify user owns this conversation
        const { data: conv } = await supabase
            .from('conversations')
            .select('id')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (!conv) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const { data: messages, error } = await supabase
            .from('messages')
            .select('id, role, content, sources, created_at')
            .eq('conversation_id', id)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return NextResponse.json(messages || []);
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
