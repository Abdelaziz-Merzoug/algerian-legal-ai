import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Not configured' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const [users, documents, articles, conversations, messages, feedback, categories] =
            await Promise.all([
                supabase.from('profiles').select('id', { count: 'exact', head: true }),
                supabase.from('legal_documents').select('id', { count: 'exact', head: true }),
                supabase.from('legal_articles').select('id', { count: 'exact', head: true }),
                supabase.from('conversations').select('id', { count: 'exact', head: true }),
                supabase.from('messages').select('id', { count: 'exact', head: true }),
                supabase.from('feedback').select('id', { count: 'exact', head: true }),
                supabase.from('legal_categories').select('id', { count: 'exact', head: true }),
            ]);

        // Pending feedback count
        const pendingFeedback = await supabase
            .from('feedback')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending');

        return NextResponse.json({
            totalUsers: users.count || 0,
            totalDocuments: documents.count || 0,
            totalArticles: articles.count || 0,
            totalConversations: conversations.count || 0,
            totalMessages: messages.count || 0,
            totalFeedback: feedback.count || 0,
            pendingFeedback: pendingFeedback.count || 0,
            activeCategories: categories.count || 0,
        });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
