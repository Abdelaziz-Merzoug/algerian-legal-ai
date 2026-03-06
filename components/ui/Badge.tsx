'use client';

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'default' | 'gold';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
    success: 'bg-success/15 text-success border-success/30',
    error: 'bg-error/15 text-error border-error/30',
    warning: 'bg-warning/15 text-warning border-warning/30',
    info: 'bg-info/15 text-info border-info/30',
    default: 'bg-text-light/15 text-text-light border-text-light/30',
    gold: 'bg-teal/10 text-teal border-teal/30',
};

export default function Badge({
    children,
    variant = 'default',
    className = '',
}: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center
        px-2.5 py-0.5
        text-xs font-semibold
        rounded-full border
        ${variantClasses[variant]}
        ${className}
      `}
        >
            {children}
        </span>
    );
}
