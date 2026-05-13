import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { LegajoState, RiskBand } from "@/lib/types";

const STATE_LABELS: Record<LegajoState, string> = {
  borrador: "Borrador",
  documentacion_cargada: "Doc. cargada",
  en_revision_automatica: "Revisión automática",
  requiere_revision_humana: "Revisión humana",
  faltan_documentos: "Faltan documentos",
  subsanacion_solicitada: "Subsanación solicitada",
  aprobado_condicionado: "Aprobado condicionado",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  archivado: "Archivado",
};

const STATE_TONES: Record<LegajoState, string> = {
  borrador: "bg-[color:var(--bg-muted)] text-text-secondary border-[color:var(--border-strong)]",
  documentacion_cargada: "bg-[color:var(--info-bg)] text-[color:var(--info)] border-[color:var(--info)]/20",
  en_revision_automatica: "bg-[color:var(--info-bg)] text-[color:var(--info)] border-[color:var(--info)]/20",
  requiere_revision_humana: "bg-[color:var(--warning-bg)] text-[color:var(--warning)] border-[color:var(--warning)]/20",
  faltan_documentos: "bg-[color:var(--warning-bg)] text-[color:var(--warning)] border-[color:var(--warning)]/20",
  subsanacion_solicitada: "bg-[color:var(--warning-bg)] text-[color:var(--warning)] border-[color:var(--warning)]/20",
  aprobado_condicionado: "bg-[color:var(--success-bg)] text-[color:var(--success)] border-[color:var(--success)]/20",
  aprobado: "bg-[color:var(--success-bg)] text-[color:var(--success)] border-[color:var(--success)]/20",
  rechazado: "bg-[color:var(--danger-bg)] text-[color:var(--danger)] border-[color:var(--danger)]/20",
  archivado: "bg-[color:var(--bg-muted)] text-text-tertiary border-[color:var(--border-strong)]",
};

const RISK_LABELS: Record<RiskBand, string> = {
  bajo: "Bajo",
  medio: "Medio",
  alto: "Alto",
  critico: "Crítico",
};

const RISK_TONES: Record<RiskBand, string> = {
  bajo: "bg-[color:var(--success-bg)] text-[color:var(--success)] border-[color:var(--success)]/20",
  medio: "bg-[color:var(--warning-bg)] text-[color:var(--warning)] border-[color:var(--warning)]/20",
  alto: "bg-[color:var(--danger-bg)]/60 text-[color:var(--danger)] border-[color:var(--danger)]/30",
  critico: "bg-[color:var(--danger)] text-white border-[color:var(--danger)]",
};

export function StatePill({ state, className }: { state: LegajoState; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium leading-none", STATE_TONES[state], className)}>
      {STATE_LABELS[state]}
    </span>
  );
}

export function RiskPill({ band, score, className }: { band: RiskBand; score?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium leading-none", RISK_TONES[band], className)}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {RISK_LABELS[band]}
      {typeof score === "number" && <span className="font-mono tabular-nums opacity-80">{score}</span>}
    </span>
  );
}

export function EntityPill({ scope, className }: { scope: "PSAV" | "PSP" | "MSB"; className?: string }) {
  const label = scope === "PSAV" ? "Eluter · PSAV" : scope === "PSP" ? "ArgyPay · PSP" : "ADBLIDAI · MSB";
  return (
    <span className={cn("inline-flex items-center rounded-md border border-[color:var(--border-strong)] bg-[color:var(--bg-muted)] px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-text-secondary", className)}>
      {label}
    </span>
  );
}

export function MetaPill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md border border-[color:var(--border)] bg-[color:var(--bg-muted)] px-1.5 py-0.5 text-xs text-text-secondary", className)}>
      {children}
    </span>
  );
}
