import { Card } from "@/components/ui/card";
import type { Legajo } from "@/lib/types";
import { FileText, AlertCircle, Flag, Users } from "lucide-react";

export function StatStrip({ legajo }: { legajo: Legajo }) {
  const received = legajo.documents.filter((d) => d.status.startsWith("recibido")).length;
  const missing = legajo.documents.filter((d) => d.status === "faltante_obligatorio").length;
  const openFlags = legajo.redFlags.filter((f) => f.status === "abierta").length;

  const items = [
    { label: "Documentos recibidos", value: `${received} / ${legajo.documents.length}`, icon: FileText },
    { label: "Faltantes obligatorios", value: missing, icon: AlertCircle, danger: missing > 0 },
    { label: "Red flags abiertas", value: openFlags, icon: Flag, danger: openFlags >= 3 },
    { label: "Beneficiarios finales", value: legajo.beneficialOwners.length, icon: Users },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <Card key={it.label} className="px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[11px] text-text-tertiary">{it.label}</div>
                <div className={`mt-0.5 text-lg font-medium font-mono tabular-nums ${it.danger ? "text-[color:var(--danger)]" : "text-text"}`}>
                  {it.value}
                </div>
              </div>
              <Icon size={14} className="text-text-tertiary" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
