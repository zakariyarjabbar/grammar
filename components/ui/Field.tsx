import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Label({
  children,
  htmlFor
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label className="text-sm font-semibold text-ink" htmlFor={htmlFor}>
      {children}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink outline-none placeholder:text-muted/75 focus:border-primary focus:ring-2 focus:ring-primary/15",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-xl border border-line bg-white px-3.5 py-3 text-[15px] leading-6 text-ink outline-none placeholder:text-muted/75 focus:border-primary focus:ring-2 focus:ring-primary/15",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15",
        className
      )}
      {...props}
    />
  );
}
