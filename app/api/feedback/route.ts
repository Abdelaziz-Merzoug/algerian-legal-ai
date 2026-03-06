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

// GET /api/feedback — get current user's feedback history
export async function GET() {
    try {
        const supabase = await getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json([], { status: 401 });

        const { data, error } = await supabase
            .from('feedback')
            .select('id, subject, message, type, status, rating, admin_response, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data || []);
    } catch {
        return NextResponse.json([], { status: 500 });
    }
}

// POST /api/feedback — submit feedback
export async function POST(request: NextRequest) {
    try {
        const supabase = await getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { subject, message, type, rating } = await request.json();

        if (!subject || !message) {
            return NextResponse.json({ error: 'Subject and message required' }, { status: 400 });
        }

        const validTypes = ['general', 'bug', 'suggestion', 'complaint', 'rating', 'other'];
        const feedbackType = validTypes.includes(type) ? type : 'general';

        const insertData: Record<string, unknown> = {
            user_id: user.id,
            subject: subject.trim().substring(0, 200),
            message: message.trim().substring(0, 2000),
            type: feedbackType,
            status: 'pending',
        };

        if (rating && rating >= 1 && rating <= 5) {
            insertData.rating = rating;
        }

        const { error } = await supabase.from('feedback').insert(insertData);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
