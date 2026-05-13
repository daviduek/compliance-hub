import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { Legajo, RiskBreakdown } from "@/lib/types";
import { explainRisk } from "@/lib/risk-engine";

const LABELS: Record<keyof RiskBreakdown, string> = {
  jurisdictional: "Jurisdiccional",
  activity: "Actividad",
  documental: "Documental",
  corporate: "Estructura societaria",
  transactional: "Transaccional",
  crypto: "Cripto / activos virtuales",
  reputational: "Reputacional",
  volume: "Volumen",
  inconsistency: "Inconsistencias",
  uboPep: "UBO / PEP",
};

export function RiskFactors({ legajo }: { legajo: Legajo }) {
  const reasons = explainRisk(legajo);
  const dims = Object.entries(legajo.riskBreakdown) as Array<[keyof RiskBreakdown, number]>;
  const visible = dims.filter(([key]) => !(key === "crypto" && legajo.entityScope !== "PSAV"));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader title="Factores explicativos" description="Lectura del motor de scoring" />
        <CardBody>
          <ul className="space-y-2">
            {reasons.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-text-secondary leading-relaxed">
                <span className="text-text-tertiary mt-0.5">·</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Desglose por dimensión" description="10 dimensiones — pesos del Manual" />
        <CardBody className="space-y-2.5">
          {visible.map(([key, value]) => {
            const tone = value >= 60 ? "var(--danger)" : value >= 35 ? "var(--warning)" : "var(--success)";
            return (
              <div key={key}>
                <div className="flex items-baseline justify-between text-xs mb-1">
                  <span className="text-text-secondary">{LABELS[key]}</span>
                  <span className="font-mono tabular-nums text-text">{value}</span>
                </div>
                <div className="h-1 rounded-full bg-[color:var(--bg-muted)] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: tone }} />
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>
    </div>
  );
}
