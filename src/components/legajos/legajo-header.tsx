import { Card } from "@/components/ui/card";
import { EntityPill, StatePill } from "@/components/ui/pill";
import { RiskGauge } from "@/components/ui/risk-gauge";
import type { Legajo } from "@/lib/types";
import { daysFromNow, formatCuit, formatDate } from "@/lib/format";
import { diligenceFor } from "@/lib/risk-engine";
import { Calendar, Globe, Coins, User, MapPin } from "lucide-react";

export function LegajoHeader({ legajo }: { legajo: Legajo }) {
  const sla = daysFromNow(legajo.slaDueAt);
  return (
    <Card className="px-5 py-4">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <EntityPill scope={legajo.entityScope} />
            <StatePill state={legajo.state} />
            <span className="font-mono text-[11px] text-text-tertiary">{legajo.id}</span>
          </div>
          <h1 className="text-xl font-medium text-text leading-tight">{legajo.clientLegalName}</h1>
          {legajo.clientCommercialName && legajo.clientCommercialName !== legajo.clientLegalName && (
            <div className="text-sm text-text-tertiary mt-0.5">Nombre comercial: {legajo.clientCommercialName}</div>
          )}

          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-2 text-xs">
            <Field icon={Globe} label="País" value={`${legajo.countryFlag} · ${legajo.countryOfIncorporation}`} />
            <Field icon={MapPin} label="Forma" value={legajo.corporateForm} />
            <Field icon={User} label="Contacto" value={legajo.primaryContact} />
            <Field icon={Coins} label="Volumen mensual" value={legajo.expectedMonthlyVolume} mono />
            <Field label="Tax ID" value={<span className="font-mono">{formatCuit(legajo.taxId)}</span>} />
            <Field label="Servicio" value={legajo.requestedService} />
            <Field label="Analista" value={legajo.assignedAnalyst} />
            <Field icon={Calendar} label="SLA" value={
              <span className={sla < 0 ? "text-[color:var(--danger)]" : sla <= 2 ? "text-[color:var(--warning)]" : ""}>
                {formatDate(legajo.slaDueAt)} · {sla < 0 ? `${Math.abs(sla)}d vencido` : `${sla}d`}
              </span>
            } />
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center">
          <RiskGauge score={legajo.riskScore} band={legajo.riskBand} />
          <div className="mt-1 text-[11px] text-text-tertiary text-center max-w-[160px]">{diligenceFor(legajo.riskBand)}</div>
        </div>
      </div>
    </Card>
  );
}

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

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
