import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            // Return fallback stats if no Supabase connection
            return NextResponse.json({
                totalDocuments: 50,
                totalArticles: 2500,
                totalUsers: 100,
                totalConversations: 500,
            });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const [documentsRes, articlesRes, usersRes, conversationsRes] = await Promise.all([
            supabase.from('legal_documents').select('id', { count: 'exact', head: true }),
            supabase.from('legal_articles').select('id', { count: 'exact', head: true }),
            supabase.from('profiles').select('id', { count: 'exact', head: true }),
            supabase.from('conversations').select('id', { count: 'exact', head: true }),
        ]);

        return NextResponse.json({
            totalDocuments: documentsRes.count || 0,
            totalArticles: articlesRes.count || 0,
            totalUsers: usersRes.count || 0,
            totalConversations: conversationsRes.count || 0,
        });
    } catch {
        return NextResponse.json({
            totalDocuments: 50,
            totalArticles: 2500,
            totalUsers: 100,
            totalConversations: 500,
        });
    }
}
