import { Card } from "@/components/ui/card";
import { RiskGauge } from "@/components/ui/risk-gauge";
import type { Legajo } from "@/lib/types";
import { diligenceFor, bandLabel } from "@/lib/risk-engine";

export function StatStrip({ legajo }: { legajo: Legajo }) {
  const received = legajo.documents.filter((d) => d.status.startsWith("recibido")).length;
  const missing = legajo.documents.filter((d) => d.status === "faltante_obligatorio").length;
  const open = legajo.redFlags.filter((f) => f.status === "abierta");
  const alta = open.filter((f) => f.level === "alta" || f.level === "critica").length;
  const media = open.filter((f) => f.level === "media").length;
  const uboHighlight = legajo.beneficialOwners.some((u) => u.indirectVia || u.isPep);

  return (
    <Card className="px-4 py-3">
      <div className="grid grid-cols-1 lg:grid-cols-[160px_1fr] gap-5 items-center">
        <div className="flex flex-col items-center border-r border-[color:var(--border)] lg:pr-4">
          <RiskGauge score={legajo.riskScore} band={legajo.riskBand} size={120} />
          <div className="mt-1 text-[11px] text-center" style={{ color: legajo.riskBand === "alto" || legajo.riskBand === "critico" ? "var(--danger)" : legajo.riskBand === "medio" ? "var(--warning)" : "var(--success)" }}>
            Riesgo {bandLabel(legajo.riskBand)} · {diligenceFor(legajo.riskBand).replace("Debida diligencia ", "DD ")}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Docs recibidos" main={`${received}`} sub={`/ ${legajo.documents.length}`} />
          <Stat label="Faltantes" main={`${missing}`} tone={missing > 0 ? "warning" : "neutral"} />
          <Stat
            label="Red flags"
            main={
              <span className="flex items-baseline gap-2">
                <span className="text-[color:var(--danger)]">{alta}</span>
                <span className="text-[11px] text-text-tertiary">alta</span>
                <span className="text-text-tertiary">·</span>
                <span className="text-[color:var(--warning)]">{media}</span>
                <span className="text-[11px] text-text-tertiary">med</span>
              </span>
            }
          />
          <Stat label="UBOs detectados" main={`${legajo.beneficialOwners.length}`} highlight={uboHighlight} />
        </div>
      </div>
    </Card>
  );
}

function Stat({
  label,
  main,
  sub,
  tone,
  highlight,
}: {
  label: string;
  main: React.ReactNode;
  sub?: string;
  tone?: "warning" | "danger" | "neutral";
  highlight?: boolean;
}) {
  const toneCls =
    tone === "warning" ? "text-[color:var(--warning)]" :
    tone === "danger" ? "text-[color:var(--danger)]" : "text-text";
  return (
    <div className="rounded-md bg-[color:var(--bg-muted)] px-3 py-2.5">
      <div className="text-[11px] text-text-tertiary">{label}</div>
      <div className="mt-0.5 text-lg font-medium font-mono tabular-nums flex items-baseline gap-1">
        <span className={toneCls}>{main}</span>
        {sub && <span className="text-xs text-text-tertiary">{sub}</span>}
        {highlight && <span className="ml-1 text-[color:var(--danger)]">▲</span>}
      </div>
    </div>
  );
}
