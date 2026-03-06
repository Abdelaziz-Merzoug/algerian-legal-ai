'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { CopyIcon, CheckIcon, RefreshIcon, TrashIcon, UserIcon, ScalesIcon } from '@/components/ui/Icon';

interface Source {
    article_number: string;
    content: string;
    document_title: string;
    similarity: number;
}

interface ChatMessageProps {
    role: 'user' | 'model';
    content: string;
    sources?: Source[] | null;
    isStreaming?: boolean;
    messageId?: string;
    onDelete?: (id: string) => void;
    onRetry?: (content: string) => void;
}

export default function ChatMessage({
    role, content, sources, isStreaming, messageId, onDelete, onRetry
}: ChatMessageProps) {
    const { t, language } = useTranslation();
    const isUser = role === 'user';
    const [copied, setCopied] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* fallback */ }
    };

    const handleDelete = () => {
        if (messageId && onDelete) onDelete(messageId);
    };

    const handleRetry = () => {
        if (isUser && onRetry) onRetry(content);
    };

    return (
        <div
            className={`group flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* AI Avatar — SVG scales icon, no emoji */}
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <ScalesIcon className="w-4 h-4 text-primary" />
                </div>
            )}

            <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
                {/* Message bubble */}
                <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                        ? 'bg-primary text-white rounded-be-sm'
                        : 'bg-white border border-border text-text-primary rounded-bs-sm shadow-sm'
                        }`}
                >
                    {/* Streaming dots */}
                    {isStreaming && !content && (
                        <div className="flex items-center gap-1 py-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    )}

                    {content && (
                        <div className="whitespace-pre-wrap">
                            {content}
                            {isStreaming && (
                                <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse ms-0.5 align-middle" />
                            )}
                        </div>
                    )}
                </div>

                {/* Action buttons — appear on hover, SVG icons only */}
                {!isStreaming && content && (
                    <div className={`flex items-center gap-1 mt-1 transition-opacity duration-150 ${showActions ? 'opacity-100' : 'opacity-0'} ${isUser ? 'justify-end' : 'justify-start'}`}>
                        {/* Copy */}
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-text-muted hover:text-primary hover:bg-primary/5 transition-colors"
                            title={language === 'ar' ? 'نسخ' : 'Copy'}
                        >
                            {copied
                                ? <CheckIcon className="w-3.5 h-3.5 text-success" strokeWidth={2.5} />
                                : <CopyIcon className="w-3.5 h-3.5" />
                            }
                            <span>{copied ? (language === 'ar' ? 'تم النسخ' : 'Copied!') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
                        </button>

                        {/* Retry (user messages only) */}
                        {isUser && onRetry && (
                            <button
                                onClick={handleRetry}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-text-muted hover:text-warning hover:bg-warning/5 transition-colors"
                                title={language === 'ar' ? 'إعادة الإرسال' : 'Retry'}
                            >
                                <RefreshIcon className="w-3.5 h-3.5" />
                                <span>{language === 'ar' ? 'إعادة' : 'Retry'}</span>
                            </button>
                        )}

                        {/* Delete */}
                        {onDelete && messageId && (
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-text-muted hover:text-error hover:bg-error/5 transition-colors"
                                title={language === 'ar' ? 'حذف' : 'Delete'}
                            >
                                <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Sources */}
                {sources && sources.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                        <p className="text-xs font-semibold text-primary flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {t.chat.sources}
                        </p>
                        {sources.map((src, idx) => (
                            <div
                                key={idx}
                                className="bg-bg-secondary border border-border-light rounded-lg px-3 py-2 text-xs"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-primary font-medium">
                                        {t.chat.article} {src.article_number}
                                    </span>
                                    <span className="text-text-muted">
                                        {t.chat.similarity}: {Math.round(src.similarity * 100)}%
                                    </span>
                                </div>
                                <p className="text-text-secondary text-[11px] line-clamp-2">
                                    {src.document_title}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* User avatar — SVG user icon, no emoji */}
            {isUser && (
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="w-4 h-4 text-primary" />
                </div>
            )}
        </div>
    );
}
