'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/stores/chat-store';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function ChatSidebar() {
    const { t } = useTranslation();
    const {
        conversations,
        activeConversationId,
        fetchConversations,
        fetchMessages,
        deleteConversation,
        resetChat,
    } = useChatStore();

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // Group conversations by time
    const groupConversations = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today.getTime() - 86400000);
        const weekAgo = new Date(today.getTime() - 7 * 86400000);

        const groups: { label: string; items: typeof conversations }[] = [
            { label: t.chat.today, items: [] },
            { label: t.chat.yesterday, items: [] },
            { label: t.chat.thisWeek, items: [] },
            { label: t.chat.older, items: [] },
        ];

        conversations.forEach((conv) => {
            const date = new Date(conv.updated_at);
            if (date >= today) groups[0].items.push(conv);
            else if (date >= yesterday) groups[1].items.push(conv);
            else if (date >= weekAgo) groups[2].items.push(conv);
            else groups[3].items.push(conv);
        });

        return groups.filter((g) => g.items.length > 0);
    };

    return (
        <div className="h-full flex flex-col bg-bg-card border-e border-border">
            {/* New chat button */}
            <div className="p-3">
                <button
                    onClick={resetChat}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-light hover:bg-teal/10 border border-teal/30 rounded-xl text-teal text-sm font-medium transition-all duration-200"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t.chat.newChat}
                </button>
            </div>

            {/* Conversations list */}
            <div className="flex-1 overflow-y-auto px-2 pb-2 custom-scrollbar">
                {conversations.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-xs text-text-light">{t.chat.noConversations}</p>
                    </div>
                ) : (
                    groupConversations().map((group) => (
                        <div key={group.label} className="mb-3">
                            <p className="text-[10px] uppercase font-semibold text-text-light px-2 mb-1">
                                {group.label}
                            </p>
                            {group.items.map((conv) => (
                                <div
                                    key={conv.id}
                                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 mb-0.5 ${activeConversationId === conv.id
                                            ? 'bg-teal-light text-teal border border-teal/20'
                                            : 'text-text-light hover:bg-bg-primary hover:text-teal border border-transparent'
                                        }`}
                                    onClick={() => fetchMessages(conv.id)}
                                >
                                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span className="flex-1 text-sm truncate">{conv.title}</span>

                                    {/* Delete button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm(t.chat.deleteConfirm)) {
                                                deleteConversation(conv.id);
                                            }
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-error/20 text-error transition-all"
                                        aria-label={t.chat.deleteConversation}
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
