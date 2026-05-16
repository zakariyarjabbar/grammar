import { cn } from "@/lib/utils/cn";

type ProgressBarProps = {
  value: number;
  label?: string;
  className?: string;
};

export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={className}>
      {label ? (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-ink">{label}</span>
          <span className="text-muted">{Math.round(safeValue)}%</span>
        </div>
      ) : null}
      <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full origin-left rounded-full bg-primary transition-all duration-700 ease-out",
            safeValue > 0 && "animate-[bar-fill_700ms_ease-out_both]"
          )}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
