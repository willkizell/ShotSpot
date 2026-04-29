interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  return (
    <div
      className={`${sizeClasses[size]} border-2 border-black border-t-[#007B6F] rounded-full animate-spin ${className}`}
    />
  );
}

export function CoachCardSkeleton() {
  return (
    <div className="border-2 border-black p-5 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 bg-black/10 border-2 border-black flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-black/10 w-3/4" />
          <div className="h-3 bg-black/10 w-1/2" />
          <div className="h-3 bg-black/10 w-2/3" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-black/10 w-full" />
        <div className="h-3 bg-black/10 w-4/5" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 bg-black/10 w-16" />
        <div className="h-5 bg-black/10 w-16" />
      </div>
    </div>
  );
}
