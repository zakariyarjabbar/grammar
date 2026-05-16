import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "border-primary bg-primary text-white shadow-sm shadow-primary/10 hover:-translate-y-0.5 hover:bg-primaryHover hover:shadow-md hover:shadow-primary/15",
  secondary: "border-line bg-card text-ink hover:-translate-y-0.5 hover:border-primary/30 hover:bg-secondary",
  ghost: "border-transparent bg-transparent text-muted hover:bg-secondary hover:text-ink",
  danger: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
};

const sizes = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-10 px-4 text-sm",
  lg: "min-h-12 px-5 text-base"
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: keyof typeof sizes;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border font-medium outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: keyof typeof sizes;
  children: ReactNode;
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border font-medium outline-none focus:ring-2 focus:ring-primary/20",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
