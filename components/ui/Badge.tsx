import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeTone = "blue" | "green" | "amber" | "gray" | "red";

const tones: Record<BadgeTone, string> = {
  blue: "bg-primary/10 text-primary",
  green: "bg-green-50 text-success",
  amber: "bg-amber-50 text-warning",
  gray: "bg-gray-100 text-muted",
  red: "bg-red-50 text-red-700"
};

export function Badge({
  className,
  tone = "gray",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
}
