import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { EntityPill, RiskPill, StatePill } from "@/components/ui/pill";
import type { Legajo } from "@/lib/types";
import { daysFromNow } from "@/lib/format";

export function QueueTable({ legajos }: { legajos: Legajo[] }) {
  const open = legajos
    .filter((l) => !["aprobado", "rechazado", "archivado"].includes(l.state))
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 6);

  return (
    <Card>
      <CardHeader title="Cola priorizada" description="Top 6 legajos abiertos por nivel de riesgo" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-text-tertiary border-b border-[color:var(--border)]">
              <th className="text-left font-medium px-4 py-2">Cliente</th>
              <th className="text-left font-medium px-2 py-2">Entidad</th>
              <th className="text-left font-medium px-2 py-2">Riesgo</th>
              <th className="text-left font-medium px-2 py-2">Estado</th>
              <th className="text-right font-medium px-2 py-2 tabular-nums">SLA</th>
              <th className="text-left font-medium px-2 py-2">Analista</th>
              <th className="text-right font-medium px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {open.map((l) => {
              const days = daysFromNow(l.slaDueAt);
              const slaTone = days < 0 ? "text-[color:var(--danger)]" : days <= 2 ? "text-[color:var(--warning)]" : "text-text-secondary";
              return (
                <tr key={l.id} className="border-b border-[color:var(--border)] last:border-b-0 hover:bg-[color:var(--bg-muted)]/40 transition-colors">
                  <td className="px-4 py-2.5">
                    <Link href={`/legajos/${l.id}`} className="block">
                      <div className="font-medium text-text leading-tight">{l.clientLegalName}</div>
                      <div className="font-mono text-[11px] text-text-tertiary mt-0.5">{l.id} · {l.taxId}</div>
                    </Link>
                  </td>
                  <td className="px-2 py-2.5"><EntityPill scope={l.entityScope} /></td>
                  <td className="px-2 py-2.5"><RiskPill band={l.riskBand} score={l.riskScore} /></td>
                  <td className="px-2 py-2.5"><StatePill state={l.state} /></td>
                  <td className={`px-2 py-2.5 text-right font-mono tabular-nums text-xs ${slaTone}`}>
                    {days < 0 ? `${Math.abs(days)}d vencido` : `${days}d`}
                  </td>
                  <td className="px-2 py-2.5 text-xs text-text-secondary">{l.assignedAnalyst}</td>
                  <td className="px-4 py-2.5 text-right">
                    <Link href={`/legajos/${l.id}`} className="text-xs text-[color:var(--accent)] hover:underline">Abrir →</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

