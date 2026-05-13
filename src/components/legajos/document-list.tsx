import { Card, CardHeader } from "@/components/ui/card";
import type { Document, DocStatus } from "@/lib/types";
import { CheckCircle2, AlertCircle, XCircle, Clock, FileX, FileText } from "lucide-react";

const STATUS_META: Record<DocStatus, { label: string; icon: typeof CheckCircle2; tone: string }> = {
  recibido_valido: { label: "Recibido · válido", icon: CheckCircle2, tone: "text-[color:var(--success)]" },
  recibido_revision: { label: "Recibido · en revisión", icon: AlertCircle, tone: "text-[color:var(--warning)]" },
  vencido: { label: "Vencido", icon: Clock, tone: "text-[color:var(--danger)]" },
  ilegible: { label: "Ilegible", icon: FileX, tone: "text-[color:var(--danger)]" },
  rechazado: { label: "Rechazado", icon: XCircle, tone: "text-[color:var(--danger)]" },
  faltante_obligatorio: { label: "Faltante obligatorio", icon: AlertCircle, tone: "text-[color:var(--danger)]" },
  faltante_recomendado: { label: "Faltante recomendado", icon: AlertCircle, tone: "text-text-tertiary" },
};

export function DocumentList({ documents }: { documents: Document[] }) {
  const received = documents.filter((d) => d.status.startsWith("recibido")).length;
  const missing = documents.filter((d) => d.status === "faltante_obligatorio").length;

  return (
    <Card>
      <CardHeader
        title="Documentos"
        description={`${received} recibidos · ${missing} faltantes obligatorios · ${documents.length} totales`}
      />
      <ul className="divide-y divide-[color:var(--border)]">
        {documents.map((d) => {
          const meta = STATUS_META[d.status];
          const Icon = meta.icon;
          return (
            <li key={d.id} className="px-4 py-2.5 flex items-start gap-3">
              <Icon size={15} className={`mt-0.5 shrink-0 ${meta.tone}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-sm font-medium text-text truncate">{d.label}</div>
                  {d.isMandatory && (
                    <span className="text-[10px] uppercase tracking-wide text-text-tertiary shrink-0">Obligatorio</span>
                  )}
                </div>
                <div className={`text-xs ${meta.tone} mt-0.5`}>{meta.label}</div>
                {d.filename && (
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-text-tertiary">
                    <FileText size={10} />
                    {d.filename}
                  </div>
                )}
                {d.observation && (
                  <div className="mt-1 text-[11px] text-text-secondary leading-snug">
                    <span className="text-text-tertiary">Observación: </span>{d.observation}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
