"use client";

interface FilterPillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FilterPill({ label, active = false, onClick, className = "" }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-semibold tracking-wide uppercase border-2 transition-colors ${
        active
          ? "bg-black text-[#D7D7D7] border-black"
          : "bg-transparent text-black border-black hover:bg-black hover:text-[#D7D7D7]"
      } ${className}`}
    >
      {label}
    </button>
  );
}
