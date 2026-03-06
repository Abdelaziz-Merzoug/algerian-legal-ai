import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET /api/stats — public, returns platform statistics for landing page
export async function GET() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const [documents, articles, users, conversations] = await Promise.all([
            supabase.from('legal_documents').select('*', { count: 'exact', head: true }).eq('status', 'active'),
            supabase.from('legal_articles').select('*', { count: 'exact', head: true }).eq('is_active', true),
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('conversations').select('*', { count: 'exact', head: true }),
        ]);

        return NextResponse.json({
            totalDocuments: documents.count || 0,
            totalArticles: articles.count || 0,
            totalUsers: users.count || 0,
            totalConversations: conversations.count || 0,
        });
    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json({
            totalDocuments: 0,
            totalArticles: 0,
            totalUsers: 0,
            totalConversations: 0,
        });
    }
}
