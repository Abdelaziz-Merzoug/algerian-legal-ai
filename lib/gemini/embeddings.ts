import { getGeminiClient } from './client';

const EMBEDDING_MODEL = 'text-embedding-004';
const EMBEDDING_DIMENSIONS = 768;

/**
 * Generate a single 768-dimensional embedding for a piece of text.
 * Uses gemini-embedding-001 with outputDimensionality: 768.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

    const result = await model.embedContent({
        content: { parts: [{ text }], role: 'user' },
        taskType: 'RETRIEVAL_DOCUMENT' as never,
    });

    const embedding = result.embedding.values;

    // Ensure we have exactly 768 dimensions
    if (embedding.length !== EMBEDDING_DIMENSIONS) {
        console.warn(
            `Expected ${EMBEDDING_DIMENSIONS} dimensions, got ${embedding.length}. Truncating/padding.`
        );
        if (embedding.length > EMBEDDING_DIMENSIONS) {
            return embedding.slice(0, EMBEDDING_DIMENSIONS);
        }
        // Pad with zeros if shorter (shouldn't happen)
        return [...embedding, ...new Array(EMBEDDING_DIMENSIONS - embedding.length).fill(0)];
    }

    return embedding;
}

/**
 * Generate embeddings for a query (for searching, not storing).
 */
export async function generateQueryEmbedding(text: string): Promise<number[]> {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

    const result = await model.embedContent({
        content: { parts: [{ text }], role: 'user' },
        taskType: 'RETRIEVAL_QUERY' as never,
    });

    const embedding = result.embedding.values;

    if (embedding.length > EMBEDDING_DIMENSIONS) {
        return embedding.slice(0, EMBEDDING_DIMENSIONS);
    }

    return embedding;
}

/**
 * Generate embeddings for multiple texts in batch.
 * Processes sequentially to avoid rate limits.
 */
export async function generateEmbeddings(
    texts: string[]
): Promise<number[][]> {
    const embeddings: number[][] = [];

    for (const text of texts) {
        const embedding = await generateEmbedding(text);
        embeddings.push(embedding);
        // Small delay to avoid rate limit (Gemini free tier)
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return embeddings;
}
