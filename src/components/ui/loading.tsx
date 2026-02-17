import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ className }: { className?: string }) => {
    return (
        <div className={`flex items-center justify-center p-4 ${className}`}>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
};

export const FullPageLoader = () => {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-medium text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
};
