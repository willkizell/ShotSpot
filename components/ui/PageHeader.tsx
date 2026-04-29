import Link from "next/link";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, breadcrumbs, description, actions }: PageHeaderProps) {
  return (
    <div className="border-b-2 border-black pb-6 mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-xs text-black/50 mb-3 uppercase tracking-wider">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-black transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-black font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-4xl tracking-tight leading-none"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            {title}
          </h1>
          {description && <p className="mt-2 text-sm text-black/60">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
