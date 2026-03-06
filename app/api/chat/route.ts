import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { generateEmbedding } from '@/lib/gemini/embeddings';
import { streamChat } from '@/lib/gemini/chat';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // Ignore in Server Component
                        }
                    },
                },
            }
        );

        // Authenticate user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { message, conversationId } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        if (message.length > 2000) {
            return NextResponse.json({ error: 'Message too long' }, { status: 400 });
        }

        // 1. Get or create conversation
        let convId = conversationId;
        if (!convId) {
            const title = message.substring(0, 80) + (message.length > 80 ? '...' : '');
            const { data: conv, error: convError } = await supabase
                .from('conversations')
                .insert({ user_id: user.id, title })
                .select('id')
                .single();
            if (convError) throw convError;
            convId = conv.id;
        }

        // 2. Save user message
        await supabase.from('messages').insert({
            conversation_id: convId,
            role: 'user',
            content: message,
        });

        // 3. RAG: Generate embedding and search for relevant articles
        let sources: Array<{
            article_number: string;
            content: string;
            document_title_ar: string;
            document_title_en: string;
            similarity: number;
        }> = [];

        try {
            const embedding = await generateEmbedding(message);
            const { data: matches } = await supabase.rpc('match_articles', {
                query_embedding: embedding,
                match_threshold: 0.5,
                match_count: 5,
            });
            if (matches && matches.length > 0) {
                sources = matches;
            }
        } catch (embeddingError) {
            console.error('Embedding/search error:', embeddingError);
            // Continue without sources if embedding fails
        }

        // 4. Build context from retrieved articles
        let legalContext = '';
        if (sources.length > 0) {
            legalContext = '\n\n--- المصادر القانونية / Legal Sources ---\n';
            sources.forEach((src, idx) => {
                legalContext += `\n[${idx + 1}] ${src.document_title_ar} — المادة ${src.article_number}\n${src.content}\n`;
            });
        }

        // 5. Build system prompt
        const systemPrompt = `أنت المستشار القانوني الجزائري — مساعد ذكي متخصص في القانون الجزائري.

قواعد مهمة:
1. أجب فقط عن الأسئلة القانونية المتعلقة بالقانون الجزائري
2. استخدم المصادر القانونية المقدمة إذا كانت متوفرة
3. اذكر أرقام المواد القانونية في إجاباتك
4. إذا لم تكن متأكداً، قل ذلك بوضوح
5. أجب بنفس لغة السؤال (عربي أو إنجليزي)
6. ذكّر المستخدم دائماً بأن هذه استشارة إرشادية وليست بديلاً عن محامٍ مختص
7. كن مهذباً ومحترفاً في إجاباتك

${legalContext ? 'استخدم المصادر التالية في إجابتك:' + legalContext : 'لا توجد مصادر قانونية محددة لهذا السؤال. أجب بناءً على معرفتك العامة بالقانون الجزائري مع التنويه بذلك.'}`;

        // 6. Get previous messages for context
        const { data: history } = await supabase
            .from('messages')
            .select('role, content')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true })
            .limit(20);

        const chatHistory = (history || []).map((msg) => ({
            role: msg.role as 'user' | 'model',
            parts: [{ text: msg.content }],
        }));

        // 7. Stream AI response
        const stream = streamChat(systemPrompt, message);

        // Create readable stream for SSE
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                let fullResponse = '';
                try {
                    for await (const text of stream) {
                        if (text) {
                            fullResponse += text;
                            controller.enqueue(
                                encoder.encode(`data: ${JSON.stringify({ text, sources: sources.length > 0 ? sources : undefined })}\n\n`)
                            );
                        }
                    }

                    // Save assistant response
                    await supabase.from('messages').insert({
                        conversation_id: convId,
                        role: 'model',
                        content: fullResponse,
                        sources: sources.length > 0 ? sources : null,
                    });

                    // Send done signal with conversation ID
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ done: true, conversationId: convId })}\n\n`)
                    );
                } catch (streamError) {
                    console.error('Stream error:', streamError);
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`)
                    );
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
