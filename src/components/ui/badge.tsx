import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "accent";

const tones: Record<Tone, string> = {
  neutral: "bg-[color:var(--bg-muted)] text-text-secondary border-[color:var(--border-strong)]",
  info: "bg-[color:var(--info-bg)] text-[color:var(--info)] border-[color:var(--info)]/20",
  success: "bg-[color:var(--success-bg)] text-[color:var(--success)] border-[color:var(--success)]/20",
  warning: "bg-[color:var(--warning-bg)] text-[color:var(--warning)] border-[color:var(--warning)]/20",
  danger: "bg-[color:var(--danger-bg)] text-[color:var(--danger)] border-[color:var(--danger)]/20",
  accent: "bg-[color:var(--accent)]/10 text-[color:var(--accent)] border-[color:var(--accent)]/20",
};

export function Badge({
  tone = "neutral",
  children,
  className,
  mono,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  mono?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-medium leading-none",
        tones[tone],
        mono && "font-mono tabular-nums",
        className
      )}
    >
      {children}
    </span>
  );
}
