'use client';

interface BarChartProps {
    data: { label: string; value: number }[];
    maxHeight?: number;
    barColor?: string;
    className?: string;
    showValues?: boolean;
}

export default function BarChart({
    data,
    maxHeight = 160,
    barColor = 'bg-teal',
    className = '',
    showValues = true,
}: BarChartProps) {
    const maxValue = Math.max(...data.map((d) => d.value), 1);

    return (
        <div className={`${className}`}>
            <div className="flex items-end gap-1 sm:gap-2" style={{ height: maxHeight }}>
                {data.map((item, idx) => {
                    const height = (item.value / maxValue) * 100;
                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                            {showValues && item.value > 0 && (
                                <span className="text-[10px] text-text-light mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {item.value}
                                </span>
                            )}
                            <div
                                className={`w-full ${barColor} rounded-t-sm transition-all duration-500 ease-out min-h-[2px] hover:opacity-80`}
                                style={{
                                    height: `${Math.max(height, 2)}%`,
                                    animationDelay: `${idx * 50}ms`,
                                }}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="flex gap-1 sm:gap-2 mt-2 border-t border-border pt-2">
                {data.map((item, idx) => (
                    <div key={idx} className="flex-1 text-center">
                        <span className="text-[9px] sm:text-[10px] text-text-light leading-none block truncate">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
