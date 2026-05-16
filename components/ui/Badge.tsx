import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeTone = "blue" | "green" | "amber" | "gray" | "red";

const tones: Record<BadgeTone, string> = {
  blue: "border-primary/10 bg-primarySoft text-primary",
  green: "border-green-100 bg-successSoft text-success",
  amber: "border-amber-100 bg-warningSoft text-amber-700",
  gray: "border-line bg-secondary text-muted",
  red: "border-red-100 bg-errorSoft text-red-700"
};

export function Badge({
  className,
  tone = "gray",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
