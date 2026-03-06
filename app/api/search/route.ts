import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET /api/search?q=...&category=...&page=1 — public full-text search
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q')?.trim() || '';
        const categoryId = searchParams.get('category') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = 20;
        const offset = (page - 1) * limit;

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [], total: 0, page, totalPages: 0 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Build query
        let dbQuery = supabase
            .from('legal_articles')
            .select(`
        id,
        article_number,
        content,
        document_id,
        legal_documents!inner (
          id,
          title_ar,
          title_en,
          category_id,
          legal_categories (
            name_ar,
            name_en
          )
        )
      `, { count: 'exact' })
            .eq('is_active', true)
            .ilike('content', `%${query}%`)
            .range(offset, offset + limit - 1);

        if (categoryId) {
            dbQuery = dbQuery.eq('legal_documents.category_id', categoryId);
        }

        const { data, count, error } = await dbQuery;

        if (error) throw error;

        interface ArticleRow {
            id: string;
            article_number: string | null;
            content: string;
            document_id: string;
            legal_documents: {
                id: string;
                title_ar: string;
                title_en: string | null;
                category_id: string;
                legal_categories: {
                    name_ar: string;
                    name_en: string;
                } | null;
            };
        }

        const results = (data as unknown as ArticleRow[] || []).map((item) => ({
            id: item.id,
            article_number: item.article_number,
            content: item.content,
            document_id: item.document_id,
            document_title_ar: item.legal_documents?.title_ar || '',
            document_title_en: item.legal_documents?.title_en || '',
            category_name_ar: item.legal_documents?.legal_categories?.name_ar || '',
            category_name_en: item.legal_documents?.legal_categories?.name_en || '',
        }));

        const total = count || 0;
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({ results, total, page, totalPages });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json({ results: [], total: 0, page: 1, totalPages: 0 }, { status: 500 });
    }
}
