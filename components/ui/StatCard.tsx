import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/Card";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: ReactNode;
  detail?: string;
};

export function StatCard({ label, value, icon, detail }: StatCardProps) {
  return (
    <Card className="transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lift">
      <CardContent className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
          {detail ? <p className="mt-1 text-sm leading-6 text-body">{detail}</p> : null}
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primarySoft text-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
