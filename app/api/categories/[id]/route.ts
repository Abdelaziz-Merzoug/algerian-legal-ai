import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET /api/categories/[id] — public, returns category info + its documents
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const docId = searchParams.get('docId');
        const fetchArticles = searchParams.get('articles') === 'true';

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // If requesting articles for a specific document
        if (docId && fetchArticles) {
            const { data: articles } = await supabase
                .from('legal_articles')
                .select('id, article_number, content')
                .eq('document_id', docId)
                .eq('is_active', true)
                .order('chunk_index', { ascending: true })
                .limit(50);
            return NextResponse.json({ articles: articles || [] });
        }

        // Get category
        const { data: category, error: catError } = await supabase
            .from('legal_categories')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single();

        if (catError || !category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        // Get documents in this category
        const { data: documents } = await supabase
            .from('legal_documents')
            .select('id, title_ar, title_en, document_type, source, year, status, total_articles, created_at')
            .eq('category_id', id)
            .eq('status', 'active')
            .order('year', { ascending: false });

        // Get article counts per document
        const enrichedDocs = await Promise.all(
            (documents || []).map(async (doc) => {
                const { count } = await supabase
                    .from('legal_articles')
                    .select('*', { count: 'exact', head: true })
                    .eq('document_id', doc.id)
                    .eq('is_active', true);

                return { ...doc, article_count: count || 0 };
            })
        );

        return NextResponse.json({ category, documents: enrichedDocs });
    } catch (error) {
        console.error('Category detail error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
