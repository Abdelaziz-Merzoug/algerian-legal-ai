import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Shared Gemini AI client instance.
 * Uses GEMINI_API_KEY (server-side only, never exposed to client).
 */
function getGeminiClient(): GoogleGenerativeAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('Missing GEMINI_API_KEY environment variable');
    }
    return new GoogleGenerativeAI(apiKey);
}

/**
 * Get the chat model (gemini-2.5-flash) for streaming conversations.
 */
export function getChatModel() {
    const genAI = getGeminiClient();
    return genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
    });
}

/**
 * Get the embedding model (gemini-embedding-001) for vector generation.
 */
export function getEmbeddingModel() {
    const genAI = getGeminiClient();
    return genAI.getGenerativeModel({
        model: 'text-embedding-004',
    });
}

export { getGeminiClient };
