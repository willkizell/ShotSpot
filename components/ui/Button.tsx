"use client";

import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "accent";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-black text-[#D7D7D7] border-2 border-black hover:bg-[#007B6F] hover:border-[#007B6F]",
  secondary: "bg-transparent text-black border-2 border-black hover:bg-black hover:text-[#D7D7D7]",
  ghost: "bg-transparent text-black border-2 border-transparent hover:border-black",
  destructive: "bg-transparent text-red-700 border-2 border-red-700 hover:bg-red-700 hover:text-white",
  accent: "bg-[#007B6F] text-white border-2 border-[#007B6F] hover:bg-black hover:border-black",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center font-semibold tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {loading ? <span className="opacity-70">Loading…</span> : children}
      </button>
    );
  }
);

Button.displayName = "Button";
