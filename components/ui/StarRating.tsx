'use client';

import { useState } from 'react';

interface StarRatingProps {
    value: number;
    onChange?: (rating: number) => void;
    size?: 'sm' | 'md' | 'lg';
    readonly?: boolean;
    className?: string;
}

export default function StarRating({
    value,
    onChange,
    size = 'md',
    readonly = false,
    className = '',
}: StarRatingProps) {
    const [hoverValue, setHoverValue] = useState(0);

    const sizeClasses = {
        sm: 'text-lg gap-0.5',
        md: 'text-2xl gap-1',
        lg: 'text-3xl gap-1.5',
    };

    const displayValue = hoverValue || value;

    return (
        <div
            className={`flex items-center ${sizeClasses[size]} ${className}`}
            onMouseLeave={() => !readonly && setHoverValue(0)}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    className={`transition-all duration-200 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-125'
                        } ${star <= displayValue ? 'drop-shadow-[0_0_4px_rgba(212,175,55,0.5)]' : 'opacity-30'}`}
                    onClick={() => !readonly && onChange?.(star)}
                    onMouseEnter={() => !readonly && setHoverValue(star)}
                >
                    {star <= displayValue ? '★' : '☆'}
                </button>
            ))}
            {value > 0 && (
                <span className="text-xs text-text-light ms-2 font-medium">
                    {value}/5
                </span>
            )}
        </div>
    );
}
