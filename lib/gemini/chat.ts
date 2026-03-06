import { getChatModel } from './client';

/**
 * Stream a chat response from Gemini gemini-2.5-flash.
 * Returns an async generator that yields text chunks.
 */
export async function* streamChat(
    systemPrompt: string,
    userMessage: string
): AsyncGenerator<string, void, unknown> {
    const model = getChatModel();

    const result = await model.generateContentStream({
        contents: [
            {
                role: 'user',
                parts: [{ text: userMessage }],
            },
        ],
        systemInstruction: {
            role: 'system',
            parts: [{ text: systemPrompt }],
        },
    });

    for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
            yield text;
        }
    }
}

/**
 * Generate a single non-streaming response from Gemini.
 * Useful for generating conversation titles.
 */
export async function generateText(
    prompt: string,
    systemPrompt?: string
): Promise<string> {
    const model = getChatModel();

    const result = await model.generateContent({
        contents: [
            {
                role: 'user',
                parts: [{ text: prompt }],
            },
        ],
        ...(systemPrompt && {
            systemInstruction: {
                role: 'system',
                parts: [{ text: systemPrompt }],
            },
        }),
    });

    return result.response.text();
}
