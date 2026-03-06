import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateEmbedding } from '@/lib/gemini/embeddings';
import { chunkLegalText, truncateForEmbedding } from '@/lib/utils/chunking';

// POST /api/admin/process — process a legal document into articles + embeddings
export async function POST(request: NextRequest) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { documentId } = await request.json();
        if (!documentId) {
            return NextResponse.json({ error: 'documentId required' }, { status: 400 });
        }

        // 1. Fetch the document
        const { data: doc, error: docError } = await supabase
            .from('legal_documents')
            .select('*')
            .eq('id', documentId)
            .single();

        if (docError || !doc) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        if (!doc.content || doc.content.trim().length === 0) {
            return NextResponse.json({ error: 'Document has no content' }, { status: 400 });
        }

        // 2. Chunk the text into articles
        const { chunks } = chunkLegalText(doc.content, doc.title_ar);

        if (chunks.length === 0) {
            return NextResponse.json({ error: 'No chunks generated' }, { status: 400 });
        }

        // 3. Delete existing articles for this document
        await supabase.from('legal_articles').delete().eq('document_id', documentId);

        // 4. Process each chunk: generate embedding and save
        let processedCount = 0;
        const errors: string[] = [];

        for (const chunk of chunks) {
            try {
                const embedding = await generateEmbedding(
                    truncateForEmbedding(chunk.content)
                );

                const { error: insertError } = await supabase
                    .from('legal_articles')
                    .insert({
                        document_id: documentId,
                        article_number: chunk.article_number,
                        content: chunk.content,
                        embedding: JSON.stringify(embedding),
                    });

                if (insertError) {
                    errors.push(`Article ${chunk.article_number}: ${insertError.message}`);
                } else {
                    processedCount++;
                }

                // Delay to respect rate limits
                await new Promise((resolve) => setTimeout(resolve, 200));
            } catch (chunkError) {
                errors.push(
                    `Article ${chunk.article_number}: ${chunkError instanceof Error ? chunkError.message : 'Unknown error'}`
                );
            }
        }

        // 5. Update document status
        await supabase
            .from('legal_documents')
            .update({ status: 'active' })
            .eq('id', documentId);

        return NextResponse.json({
            success: true,
            totalChunks: chunks.length,
            processedCount,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error('Process error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
