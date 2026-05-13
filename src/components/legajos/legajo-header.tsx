import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { EntityPill, StatePill } from "@/components/ui/pill";
import type { Legajo } from "@/lib/types";
import { daysFromNow, formatCuit } from "@/lib/format";
import { Eye } from "lucide-react";

function initialsOf(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function LegajoHeader({ legajo }: { legajo: Legajo }) {
  const sla = daysFromNow(legajo.slaDueAt);
  const slaTone = sla < 0 ? "text-[color:var(--danger)]" : sla <= 2 ? "text-[color:var(--warning)]" : "text-text-tertiary";
  const initials = initialsOf(legajo.clientCommercialName || legajo.clientLegalName);
  const summaryLine = [
    `CUIT ${formatCuit(legajo.taxId)}`,
    legajo.clientType.replace(/_/g, " "),
    legajo.requestedService,
    `Volumen estimado ${legajo.expectedMonthlyVolume}/mes`,
  ].join(" · ");

  return (
    <Card className="px-5 py-4">
      <div className="flex items-start gap-4">
        <div className="size-11 shrink-0 rounded-full bg-[color:var(--info-bg)] text-[color:var(--info)] flex items-center justify-center text-sm font-medium border border-[color:var(--info)]/20">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base font-medium text-text leading-tight">{legajo.clientLegalName}</h1>
            <EntityPill scope={legajo.entityScope} />
            <span className="inline-flex items-center rounded-full border border-[color:var(--border-strong)] bg-[color:var(--bg-muted)] px-2 py-0.5 text-[11px] text-text-secondary">
              {legajo.countryFlag === "AR" ? "Argentina" : legajo.countryFlag === "US" ? "United States" : legajo.countryOfIncorporation}
            </span>
          </div>
          <p className="mt-1 text-xs text-text-secondary leading-snug">{summaryLine}</p>
        </div>

        <div className="shrink-0 text-right">
          <div className="inline-flex items-center gap-1.5">
            <StatePill state={legajo.state} />
          </div>
          <div className={`mt-1.5 text-[11px] ${slaTone} flex items-center justify-end gap-1`}>
            <Eye size={10} className="opacity-70" />
            SLA · {sla < 0 ? `${Math.abs(sla)}d vencido` : `${sla} días restantes`}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function LegajoSubHeader({ legajo, children }: { legajo: Legajo; children?: ReactNode }) {
  return (
    <Card className="px-5 py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-2 text-xs">
        <Field label="Tax ID" value={<span className="font-mono">{formatCuit(legajo.taxId)}</span>} />
        <Field label="Forma jurídica" value={legajo.corporateForm} />
        <Field label="Contacto" value={legajo.primaryContact} />
        <Field label="Volumen mensual" value={legajo.expectedMonthlyVolume} mono />
        {children}
      </div>
    </Card>
  );
}

function Field({ icon: Icon, label, value, mono }: { icon?: LucideIcon; label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-text-tertiary">
        {Icon && <Icon size={10} className="opacity-70" />}
        {label}
      </div>
      <div className={`mt-0.5 text-text truncate ${mono ? "font-mono tabular-nums" : ""}`}>{value}</div>
    </div>
  );
}
