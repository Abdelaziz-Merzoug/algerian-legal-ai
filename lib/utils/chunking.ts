/**
 * Split a legal document into chunks suitable for embedding.
 * Each chunk contains one or more articles/sections.
 */

interface ChunkResult {
    chunks: {
        article_number: string;
        content: string;
        chunk_index: number;
    }[];
}

/**
 * Split legal text into individual articles.
 * Handles common Arabic/French article numbering patterns:
 * - المادة 1 / المادة الأولى
 * - Article 1 / Art. 1
 * - Numbered sections (1. / 1- / 1))
 */
export function chunkLegalText(
    fullText: string,
    documentTitle: string
): ChunkResult {
    if (!fullText || !fullText.trim()) {
        return { chunks: [] };
    }

    // Try to split by article patterns
    const articlePattern =
        /(?:المادة|المادّة|مادة|Article|Art\.?)\s*(\d+(?:\s*(?:مكرر|bis|ter))?(?:\s*\d*)?)/gi;

    const matches = [...fullText.matchAll(articlePattern)];

    if (matches.length > 0) {
        const chunks: ChunkResult['chunks'] = [];

        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            const articleNumber = match[1].trim();
            const startIndex = match.index!;
            const endIndex = i + 1 < matches.length ? matches[i + 1].index! : fullText.length;
            const content = fullText.substring(startIndex, endIndex).trim();

            if (content.length > 10) {
                // Skip empty chunks
                chunks.push({
                    article_number: articleNumber,
                    content: content.substring(0, 2000), // Limit chunk size
                    chunk_index: i,
                });
            }
        }

        return { chunks };
    }

    // Fallback: split by paragraphs/sections (double newlines)
    const paragraphs = fullText.split(/\n\s*\n/).filter((p) => p.trim().length > 20);

    if (paragraphs.length > 0) {
        return {
            chunks: paragraphs.map((para, idx) => ({
                article_number: `§${idx + 1}`,
                content: para.trim().substring(0, 2000),
                chunk_index: idx,
            })),
        };
    }

    // Last resort: single chunk
    return {
        chunks: [
            {
                article_number: '1',
                content: fullText.substring(0, 2000),
                chunk_index: 0,
            },
        ],
    };
}

/**
 * Maximum text length for embedding (Gemini has token limits).
 */
export function truncateForEmbedding(text: string, maxLength = 1500): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
