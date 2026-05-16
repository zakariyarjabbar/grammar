import { Loader2 } from "lucide-react";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-lg border border-line bg-card p-8 text-muted shadow-soft">
      <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
      <span className="font-medium">{label}</span>
    </div>
  );
}
