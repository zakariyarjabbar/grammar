import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Label({
  children,
  htmlFor,
  className
}: {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label className={cn("text-sm font-semibold text-ink", className)} htmlFor={htmlFor}>
      {children}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-lg border border-line bg-white px-3.5 text-[15px] text-ink shadow-sm shadow-slate-950/[0.02] outline-none placeholder:text-muted/75 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted",
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
        "min-h-32 w-full rounded-lg border border-line bg-white px-3.5 py-3 text-[15px] leading-7 text-ink shadow-sm shadow-slate-950/[0.02] outline-none placeholder:text-muted/75 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted",
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
        "min-h-11 w-full rounded-lg border border-line bg-white px-3.5 text-[15px] text-ink shadow-sm shadow-slate-950/[0.02] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted",
        className
      )}
      {...props}
    />
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  description?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

export function FormField({ id, label, description, error, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {description ? <p className="text-sm leading-6 text-muted">{description}</p> : null}
      {error ? <p className="text-sm font-medium text-error">{error}</p> : null}
    </div>
  );
}
