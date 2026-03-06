import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET /api/categories — public, returns active categories with document counts
export async function GET() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: categories, error } = await supabase
            .from('legal_categories')
            .select('id, name_ar, name_en, description_ar, description_en, icon, document_count, is_active')
            .eq('is_active', true)
            .order('created_at', { ascending: true });

        if (error) throw error;

        // Get real document counts
        const enriched = await Promise.all(
            (categories || []).map(async (cat) => {
                const { count } = await supabase
                    .from('legal_documents')
                    .select('*', { count: 'exact', head: true })
                    .eq('category_id', cat.id)
                    .eq('status', 'active');

                return { ...cat, document_count: count || 0 };
            })
        );

        return NextResponse.json(enriched);
    } catch (error) {
        console.error('Categories API error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
