import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

type AdminTableProps = {
  title: string;
  description?: string;
  controls?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AdminTable({ title, description, controls, children, className }: AdminTableProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">{title}</h2>
            {description ? <p className="mt-1 text-sm leading-6 text-body">{description}</p> : null}
          </div>
          {controls ? <div className="shrink-0">{controls}</div> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

export function AdminRecord({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className={cn("rounded-lg border border-line bg-secondary p-4 open:bg-white", className)}>
      {children}
    </details>
  );
}
