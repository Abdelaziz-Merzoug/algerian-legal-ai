'use client';

interface SkeletonLoaderProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'card';
    width?: string;
    height?: string;
    count?: number;
}

export default function SkeletonLoader({
    className = '',
    variant = 'text',
    width,
    height,
    count = 1,
}: SkeletonLoaderProps) {
    const baseClasses = 'animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%]';

    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-xl',
        card: 'rounded-xl h-40',
    };

    const items = Array.from({ length: count }, (_, i) => i);

    return (
        <>
            {items.map((i) => (
                <div
                    key={i}
                    className={`${baseClasses} ${variantClasses[variant]} ${className}`}
                    style={{
                        width: width || (variant === 'circular' ? '40px' : '100%'),
                        height: height || undefined,
                    }}
                />
            ))}
        </>
    );
}

// Pre-built skeleton patterns
export function SkeletonCard() {
    return (
        <div className="bg-bg-card border border-border rounded-xl p-6 space-y-4">
            <SkeletonLoader variant="rectangular" height="20px" width="60%" />
            <SkeletonLoader count={3} className="h-3" />
            <div className="flex gap-2">
                <SkeletonLoader variant="rectangular" height="32px" width="80px" />
                <SkeletonLoader variant="rectangular" height="32px" width="80px" />
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
                <SkeletonLoader height="16px" width="200px" />
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-border-light">
                    <SkeletonLoader variant="circular" width="32px" height="32px" />
                    <div className="flex-1 space-y-2">
                        <SkeletonLoader height="14px" width={`${60 + Math.random() * 30}%`} />
                        <SkeletonLoader height="10px" width={`${40 + Math.random() * 20}%`} />
                    </div>
                    <SkeletonLoader variant="rectangular" height="28px" width="60px" />
                </div>
            ))}
        </div>
    );
}

export function SkeletonStats({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-bg-card border border-border rounded-xl p-5 space-y-3">
                    <SkeletonLoader variant="circular" width="40px" height="40px" />
                    <SkeletonLoader height="24px" width="60px" />
                    <SkeletonLoader height="12px" width="100px" />
                </div>
            ))}
        </div>
    );
}
