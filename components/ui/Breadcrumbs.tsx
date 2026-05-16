import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("mb-5 flex min-w-0 items-center gap-2 text-sm", className)}>
      <Link
        className="inline-flex items-center gap-1 font-medium text-muted hover:text-primary"
        href="/dashboard"
      >
        <Home className="h-4 w-4" />
        Home
      </Link>
      {items.map((item, index) => {
        const current = index === items.length - 1;

        return (
          <span className="flex min-w-0 items-center gap-2" key={`${item.label}-${index}`}>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted/70" />
            {item.href && !current ? (
              <Link className="truncate font-medium text-muted hover:text-primary" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span className="truncate font-semibold text-primary" aria-current={current ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
