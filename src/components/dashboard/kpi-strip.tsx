import { Card } from "@/components/ui/card";
import type { Legajo } from "@/lib/types";
import { FolderKanban, Timer, AlertTriangle, FileWarning } from "lucide-react";

export function KpiStrip({ legajos }: { legajos: Legajo[] }) {
  const inReview = legajos.filter((l) =>
    ["requiere_revision_humana", "en_revision_automatica", "subsanacion_solicitada", "faltan_documentos"].includes(l.state)
  ).length;

  const avgSla = (() => {
    const open = legajos.filter((l) => !["aprobado", "rechazado", "archivado"].includes(l.state));
    if (open.length === 0) return 0;
    const now = Date.now();
    const days = open.map((l) => Math.max(0, Math.round((new Date(l.slaDueAt).getTime() - now) / 86400000)));
    return Math.round(days.reduce((a, b) => a + b, 0) / days.length);
  })();

  const highRiskOpen = legajos.filter(
    (l) => (l.riskBand === "alto" || l.riskBand === "critico") && !["aprobado", "rechazado", "archivado"].includes(l.state)
  ).length;

  const expiredDocs = legajos.reduce((acc, l) => acc + l.documents.filter((d) => d.status === "vencido" || d.status === "ilegible").length, 0);

  const cards = [
    { label: "Legajos en revisión", value: inReview, icon: FolderKanban, hint: "Activos en cola" },
    { label: "SLA promedio", value: `${avgSla}d`, icon: Timer, hint: "Hasta vencimiento" },
    { label: "Riesgo alto/crítico abierto", value: highRiskOpen, icon: AlertTriangle, hint: "Requieren DDR" },
    { label: "Faltantes vencidos/ilegibles", value: expiredDocs, icon: FileWarning, hint: "Documentación con observaciones" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.label} className="px-4 py-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-text-tertiary">{c.label}</div>
                <div className="mt-1 text-2xl font-medium font-mono tabular-nums">{c.value}</div>
                <div className="mt-1 text-[11px] text-text-tertiary">{c.hint}</div>
              </div>
              <div className="size-7 inline-flex items-center justify-center rounded-md bg-[color:var(--bg-muted)] text-text-secondary">
                <Icon size={14} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
