'use client';

import { useState } from 'react';

interface AccordionItem {
    id: string;
    title: string;
    content: string;
}

interface AccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
    className?: string;
}

export default function Accordion({ items, allowMultiple = false, className = '' }: AccordionProps) {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const toggle = (id: string) => {
        setOpenItems((prev) => {
            const next = new Set(allowMultiple ? prev : []);
            if (prev.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {items.map((item) => {
                const isOpen = openItems.has(item.id);
                return (
                    <div
                        key={item.id}
                        className="bg-bg-card shadow-sm border border-border-light rounded-xl overflow-hidden transition-all duration-300 hover:border-teal/30"
                    >
                        <button
                            onClick={() => toggle(item.id)}
                            className="w-full flex items-center justify-between px-5 py-4 text-start transition-colors hover:bg-bg-card"
                        >
                            <span className="text-sm font-medium text-text-primary pe-4">{item.title}</span>
                            <span
                                className={`text-teal text-lg flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                            >
                                +
                            </span>
                        </button>
                        <div
                            className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                        >
                            <div className="overflow-hidden">
                                <div className="px-5 pb-4 text-sm text-text-light leading-relaxed border-t border-border-light pt-3">
                                    {item.content}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
