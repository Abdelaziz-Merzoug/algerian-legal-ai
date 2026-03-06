'use client';

import { create } from 'zustand';

interface Message {
    id?: string;
    role: 'user' | 'model';
    content: string;
    sources?: Array<{
        article_number: string;
        content: string;
        document_title: string;
        similarity: number;
    }> | null;
    created_at?: string;
}

interface Conversation {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

interface ChatState {
    conversations: Conversation[];
    activeConversationId: string | null;
    messages: Message[];
    isLoading: boolean;
    isStreaming: boolean;
    streamingText: string;

    // Actions
    setConversations: (conversations: Conversation[]) => void;
    setActiveConversation: (id: string | null) => void;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    setIsLoading: (loading: boolean) => void;
    setIsStreaming: (streaming: boolean) => void;
    setStreamingText: (text: string) => void;
    appendStreamingText: (text: string) => void;
    resetChat: () => void;

    // Async actions
    fetchConversations: () => Promise<void>;
    fetchMessages: (conversationId: string) => Promise<void>;
    deleteConversation: (id: string) => Promise<void>;
    sendMessage: (message: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
    conversations: [],
    activeConversationId: null,
    messages: [],
    isLoading: false,
    isStreaming: false,
    streamingText: '',

    setConversations: (conversations) => set({ conversations }),
    setActiveConversation: (id) => set({ activeConversationId: id }),
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
    setIsLoading: (isLoading) => set({ isLoading }),
    setIsStreaming: (isStreaming) => set({ isStreaming }),
    setStreamingText: (streamingText) => set({ streamingText }),
    appendStreamingText: (text) => set((s) => ({ streamingText: s.streamingText + text })),
    resetChat: () =>
        set({
            activeConversationId: null,
            messages: [],
            isStreaming: false,
            streamingText: '',
        }),

    fetchConversations: async () => {
        try {
            const res = await fetch('/api/conversations');
            if (res.ok) {
                const data = await res.json();
                set({ conversations: data });
            }
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        }
    },

    fetchMessages: async (conversationId: string) => {
        set({ isLoading: true });
        try {
            const res = await fetch(`/api/conversations/${conversationId}/messages`);
            if (res.ok) {
                const data = await res.json();
                set({ messages: data, activeConversationId: conversationId, isLoading: false });
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            set({ isLoading: false });
        }
    },

    deleteConversation: async (id: string) => {
        try {
            const res = await fetch(`/api/conversations?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                const state = get();
                set({
                    conversations: state.conversations.filter((c) => c.id !== id),
                    ...(state.activeConversationId === id
                        ? { activeConversationId: null, messages: [] }
                        : {}),
                });
            }
        } catch (error) {
            console.error('Failed to delete conversation:', error);
        }
    },

    sendMessage: async (message: string) => {
        const state = get();

        // Add user message to UI immediately
        const userMessage: Message = { role: 'user', content: message };
        set({
            messages: [...state.messages, userMessage],
            isStreaming: true,
            streamingText: '',
        });

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    conversationId: state.activeConversationId,
                }),
            });

            if (!res.ok) {
                throw new Error(`Chat API error: ${res.status}`);
            }

            const reader = res.body?.getReader();
            if (!reader) throw new Error('No reader');

            const decoder = new TextDecoder();
            let fullText = '';
            let sources: Message['sources'] = null;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.error) {
                                throw new Error(data.error);
                            }

                            if (data.text) {
                                fullText += data.text;
                                set({ streamingText: fullText });
                            }

                            if (data.sources) {
                                sources = data.sources;
                            }

                            if (data.done) {
                                // Set conversation ID if new
                                if (data.conversationId && !state.activeConversationId) {
                                    set({ activeConversationId: data.conversationId });
                                }
                                // Refresh conversations list
                                get().fetchConversations();
                            }
                        } catch (parseError) {
                            // Skip invalid JSON lines
                            if (parseError instanceof SyntaxError) continue;
                            throw parseError;
                        }
                    }
                }
            }

            // Add final assistant message
            const assistantMessage: Message = {
                role: 'model',
                content: fullText,
                sources,
            };

            set((s) => ({
                messages: [...s.messages, assistantMessage],
                isStreaming: false,
                streamingText: '',
            }));
        } catch (error) {
            console.error('Send message error:', error);
            set({
                isStreaming: false,
                streamingText: '',
            });
            // Add error message
            set((s) => ({
                messages: [
                    ...s.messages,
                    {
                        role: 'model',
                        content: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.\n\nSorry, an error occurred. Please try again.',
                    },
                ],
            }));
        }
    },
}));
