'use client';

import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/stores/chat-store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import WelcomeScreen from '@/components/chat/WelcomeScreen';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ChatPage() {
    const { t, language } = useTranslation();
    const { isLoading: authLoading } = useAuth();
    const { messages, isLoading, isStreaming, streamingText } = useChatStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingText]);

    if (authLoading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="h-screen flex flex-col bg-bg-primary">
            {/* Navbar */}
            <div className="shrink-0">
                <Navbar />
            </div>

            {/* Main content */}
            <div className="flex-1 flex overflow-hidden pt-16">
                {/* Mobile sidebar toggle */}
                <button
                    className="md:hidden fixed bottom-20 start-4 z-30 p-3 bg-teal text-navy rounded-full shadow-lg hover:bg-teal-hover transition-colors"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle sidebar"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {sidebarOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Sidebar */}
                <aside
                    className={`
            w-72 shrink-0 transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'}
            md:translate-x-0
            fixed md:relative inset-y-0 start-0 z-20 pt-16 md:pt-0
          `}
                >
                    <ChatSidebar />
                </aside>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-10"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Chat area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Chat header with export */}
                    {messages.length > 0 && (
                        <div className="flex items-center justify-end px-4 py-2 border-b border-border-light">
                            <button
                                onClick={() => {
                                    const text = messages.map((m) => `${m.role === 'user' ? 'You' : 'AI'}: ${m.content}`).join('\n\n');
                                    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `legal-chat-${Date.now()}.txt`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                }}
                                className="text-xs text-text-light hover:text-teal transition-colors flex items-center gap-1"
                                title="Export"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                {language === 'ar' ? 'تصدير' : 'Export'}
                            </button>
                        </div>
                    )}

                    {messages.length === 0 && !isLoading ? (
                        <WelcomeScreen />
                    ) : (
                        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
                            <div className="max-w-3xl mx-auto space-y-6">
                                {isLoading ? (
                                    <div className="flex justify-center py-12">
                                        <LoadingSpinner />
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((msg, idx) => (
                                            <ChatMessage
                                                key={idx}
                                                role={msg.role}
                                                content={msg.content}
                                                sources={msg.sources}
                                            />
                                        ))}

                                        {/* Streaming message */}
                                        {isStreaming && (
                                            <ChatMessage
                                                role="model"
                                                content={streamingText}
                                                isStreaming
                                            />
                                        )}
                                    </>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <ChatInput />
                </div>
            </div>
        </div>
    );
}
