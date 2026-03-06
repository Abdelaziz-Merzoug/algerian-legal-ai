'use client';

import Button from './Button';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon = '📭',
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
            <span className="text-5xl mb-4" aria-hidden="true">
                {icon}
            </span>
            <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-text-light max-w-sm mb-6">{description}</p>
            )}
            {actionLabel && onAction && (
                <Button variant="primary" size="md" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
