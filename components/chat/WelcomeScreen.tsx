'use client';

import { useChatStore } from '@/stores/chat-store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { ScalesIcon, BriefcaseIcon, PeopleIcon, ShieldIcon, DocumentIcon, WriteIcon } from '@/components/icons/LegalIcons';

const suggestionIcons = [ScalesIcon, WriteIcon, BriefcaseIcon, ShieldIcon, PeopleIcon, DocumentIcon];

export default function WelcomeScreen() {
    const { t, language } = useTranslation();
    const { sendMessage } = useChatStore();

    const suggestions = [
        { Icon: suggestionIcons[0], text: t.chat.question1 },
        { Icon: suggestionIcons[1], text: t.chat.question2 },
        { Icon: suggestionIcons[2], text: t.chat.question3 },
        { Icon: suggestionIcons[3], text: t.chat.question4 },
        { Icon: suggestionIcons[4], text: language === 'ar' ? 'ما هي شروط الزواج في القانون الجزائري؟' : 'What are the marriage conditions in Algerian law?' },
        { Icon: suggestionIcons[5], text: language === 'ar' ? 'كيف أسجل شركة تجارية في الجزائر؟' : 'How do I register a company in Algeria?' },
    ];

    return (
        <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center">
                {/* Logo & title */}
                <div className="mb-8">
                    {/* Scales SVG icon — inline, no emoji */}
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-teal/10 border border-teal/20">
                        <svg width="36" height="36" viewBox="0 0 100 100" className="text-teal" aria-hidden="true">
                            <line x1="50" y1="15" x2="50" y2="68" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            <line x1="18" y1="30" x2="82" y2="30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            <path d="M 18 30 Q 8 55 18 58 Q 28 58 18 30" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="2" />
                            <path d="M 82 30 Q 72 55 82 58 Q 92 58 82 30" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="2" />
                            <rect x="43" y="68" width="14" height="4" rx="2" fill="currentColor" />
                            <rect x="38" y="72" width="24" height="3.5" rx="2" fill="currentColor" opacity="0.7" />
                            <circle cx="50" cy="14" r="4" fill="currentColor" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3 leading-tight">
                        {t.chat.welcomeTitle}
                    </h1>
                    <p className="text-text-secondary text-sm leading-relaxed max-w-lg mx-auto">
                        {t.chat.welcomeMessage}
                    </p>
                </div>

                {/* Suggested questions */}
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                        {t.chat.suggestedQuestions}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {suggestions.map(({ Icon, text }, idx) => (
                            <button
                                key={idx}
                                onClick={() => sendMessage(text)}
                                className="flex items-start gap-3 p-4 bg-white border border-border rounded-xl text-start hover:border-teal/40 hover:shadow-sm transition-all duration-200 group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-teal/20 transition-colors">
                                    <Icon className="w-4 h-4 text-teal" />
                                </div>
                                <span className="text-sm text-text-secondary group-hover:text-teal transition-colors leading-relaxed">
                                    {text}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Disclaimer */}
                <p className="mt-8 text-xs text-text-muted max-w-md mx-auto leading-relaxed">
                    {t.chat.disclaimer}
                </p>
            </div>
        </div>
    );
}
