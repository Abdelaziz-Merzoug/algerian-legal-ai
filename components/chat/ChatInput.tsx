'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/stores/chat-store';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function ChatInput() {
    const { t } = useTranslation();
    const { sendMessage, isStreaming } = useChatStore();
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = Math.min(el.scrollHeight, 150) + 'px';
        }
    }, [input]);

    const handleSubmit = () => {
        const trimmed = input.trim();
        if (!trimmed || isStreaming) return;
        if (trimmed.length > 2000) return;
        sendMessage(trimmed);
        setInput('');
        // Reset height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="border-t border-border bg-bg-card shadow-sm p-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-end gap-2 bg-bg-primary border border-border rounded-xl p-2 focus-within:border-teal/30 transition-colors">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t.chat.typeMessage}
                        rows={1}
                        className="flex-1 bg-transparent text-text-primary placeholder-text-light resize-none outline-none text-sm py-2 px-2 max-h-[150px] custom-scrollbar"
                        disabled={isStreaming}
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={!input.trim() || isStreaming}
                        className="p-2.5 rounded-lg bg-teal text-navy hover:bg-teal-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shrink-0"
                        aria-label={t.chat.send}
                    >
                        {isStreaming ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="3" className="opacity-25" />
                                <path strokeLinecap="round" strokeWidth="3" d="M4 12a8 8 0 018-8" className="opacity-75" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Disclaimer */}
                <p className="text-[10px] text-text-muted text-center mt-2">
                    {t.chat.disclaimer}
                </p>

                {/* Character count */}
                {input.length > 1500 && (
                    <p className={`text-[10px] text-center mt-1 ${input.length > 2000 ? 'text-error' : 'text-warning'}`}>
                        {input.length}/2000
                    </p>
                )}
            </div>
        </div>
    );
}
