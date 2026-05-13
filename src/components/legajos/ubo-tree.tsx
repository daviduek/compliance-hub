import { Card, CardHeader } from "@/components/ui/card";
import type { Authority, BeneficialOwner } from "@/lib/types";
import { Users, Briefcase } from "lucide-react";

export function UboTree({ owners, authorities, uboThreshold }: { owners: BeneficialOwner[]; authorities: Authority[]; uboThreshold: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader title="Beneficiarios finales" description={`Umbral aplicable: ${uboThreshold}% — ${owners.length} identificados`} />
        <ul className="divide-y divide-[color:var(--border)]">
          {owners.map((u) => (
            <li key={u.id} className="px-4 py-2.5 flex items-start gap-3">
              <Users size={14} className="mt-0.5 text-text-tertiary shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-sm font-medium text-text truncate">{u.fullName}</div>
                  <div className="font-mono tabular-nums text-sm text-text">{u.capitalPercentage}%</div>
                </div>
                <div className="text-[11px] text-text-tertiary mt-0.5">
                  {u.idType} {u.idNumber} · {u.jurisdiction}
                  {u.isPep && <span className="ml-1 text-[color:var(--danger)] font-medium">· PEP</span>}
                </div>
                {u.indirectVia && (
                  <div className="text-[11px] text-[color:var(--warning)] mt-0.5">
                    Indirecto vía {u.indirectVia}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader title="Autoridades vigentes" description={`${authorities.length} ${authorities.length === 1 ? "designada" : "designadas"}`} />
        <ul className="divide-y divide-[color:var(--border)]">
          {authorities.map((a) => (
            <li key={a.id} className="px-4 py-2.5 flex items-start gap-3">
              <Briefcase size={14} className="mt-0.5 text-text-tertiary shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text">{a.fullName}</div>
                <div className="text-[11px] text-text-tertiary mt-0.5">
                  {a.role} · designado {a.appointmentDate}
                  {a.termExpiration && <> · vence {a.termExpiration}</>}
                  {a.isPep && <span className="ml-1 text-[color:var(--danger)] font-medium">· PEP</span>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
