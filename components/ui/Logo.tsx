import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
}

const sizeClasses = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
};

export function Logo({ size = "md", href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={`tracking-tight leading-none ${sizeClasses[size]}`}
      style={{ fontFamily: "var(--font-anton)" }}
    >
      <span className="text-black">SHOT</span>
      <span className="text-[#007B6F]">SPOT</span>
    </Link>
  );
}
