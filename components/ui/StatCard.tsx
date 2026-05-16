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
    <Card className="transition hover:-translate-y-1 hover:shadow-glow">
      <CardContent className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
          {detail ? <p className="mt-1 text-sm text-muted">{detail}</p> : null}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
