import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({ title, description, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div className="border-2 border-black border-dashed p-16 flex flex-col items-center text-center">
      <div className="w-8 h-1 bg-[#007B6F] mb-6" />
      <h3
        className="text-2xl tracking-tight mb-2"
        style={{ fontFamily: "var(--font-anton)" }}
      >
        {title}
      </h3>
      {description && <p className="text-sm text-black/60 max-w-sm mb-6">{description}</p>}
      {ctaLabel && onCta && (
        <Button onClick={onCta} variant="secondary" size="sm">
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
