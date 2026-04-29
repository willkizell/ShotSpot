type BadgeVariant = "default" | "accent" | "outline" | "event";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-black text-[#D7D7D7]",
  accent: "bg-[#007B6F] text-white",
  outline: "border border-black text-black",
  event: "border border-black text-black bg-transparent",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium tracking-wide uppercase ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
