export default function Loading() {
    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
            <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-teal/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-teal border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-sm text-text-light">Loading...</p>
            </div>
        </div>
    );
}
