import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success" | "warning";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-hover)] border border-[color:var(--accent)]",
  secondary: "bg-[color:var(--bg-elevated)] text-text border border-[color:var(--border-strong)] hover:bg-[color:var(--bg-muted)]",
  ghost: "bg-transparent text-text-secondary hover:bg-[color:var(--bg-muted)] hover:text-text border border-transparent",
  danger: "bg-[color:var(--bg-elevated)] text-[color:var(--danger)] border border-[color:var(--danger)]/30 hover:bg-[color:var(--danger-bg)]",
  success: "bg-[color:var(--bg-elevated)] text-[color:var(--success)] border border-[color:var(--success)]/30 hover:bg-[color:var(--success-bg)]",
  warning: "bg-[color:var(--bg-elevated)] text-[color:var(--warning)] border border-[color:var(--warning)]/30 hover:bg-[color:var(--warning-bg)]",
};

const sizes: Record<Size, string> = {
  sm: "h-7 px-2.5 text-xs gap-1.5",
  md: "h-9 px-3.5 text-sm gap-2",
};

export function Button({ variant = "secondary", size = "md", className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/40",
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
