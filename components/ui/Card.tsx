'use client';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
};

export default function Card({
    children,
    className = '',
    hover = false,
    padding = 'md',
    onClick,
}: CardProps) {
    const isClickable = !!onClick;

    return (
        <div
            onClick={onClick}
            className={`
        bg-bg-card border border-border rounded-2xl
        ${paddingClasses[padding]}
        ${hover ? 'hover:border-teal/40 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300' : ''}
        ${isClickable ? 'cursor-pointer' : ''}
        ${className}
      `}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={
                isClickable
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onClick?.();
                        }
                    }
                    : undefined
            }
        >
            {children}
        </div>
    );
}
