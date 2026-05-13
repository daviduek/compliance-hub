import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { Legajo } from "@/lib/types";

export function EntityDistribution({ legajos }: { legajos: Legajo[] }) {
  const total = legajos.length || 1;
  const buckets = [
    { key: "PSAV", label: "Eluter SA · PSAV", count: legajos.filter((l) => l.entityScope === "PSAV").length, color: "var(--accent)" },
    { key: "PSP", label: "ArgyPay SA · PSP", count: legajos.filter((l) => l.entityScope === "PSP").length, color: "var(--info)" },
    { key: "MSB", label: "ADBLIDAI LLC · MSB", count: legajos.filter((l) => l.entityScope === "MSB").length, color: "var(--warning)" },
  ];

  return (
    <Card>
      <CardHeader title="Distribución por entidad" description="Legajos abiertos por marco regulatorio aplicable" />
      <CardBody>
        <ul className="space-y-3">
          {buckets.map((b) => {
            const pct = (b.count / total) * 100;
            return (
              <li key={b.key}>
                <div className="flex items-baseline justify-between text-xs mb-1">
                  <span className="text-text-secondary">{b.label}</span>
                  <span className="font-mono tabular-nums text-text">{b.count} <span className="text-text-tertiary">({pct.toFixed(0)}%)</span></span>
                </div>
                <div className="h-1.5 rounded-full bg-[color:var(--bg-muted)] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: b.color }} />
                </div>
              </li>
            );
          })}
        </ul>
      </CardBody>
    </Card>
  );
}
