import { Sparkles } from "lucide-react";
import type { AIAnalysis } from "@/lib/types";
import { formatDateTime } from "@/lib/format";

const REC_LABEL = {
  aprobar: "Aprobar",
  aprobar_condicionado: "Aprobar condicionado",
  subsanacion: "Solicitar subsanación",
  rechazar: "Rechazar",
};

export function AIAnalysisCard({ analysis }: { analysis: AIAnalysis }) {
  return (
    <div className="rounded-lg border border-[color:var(--info)]/25 bg-[color:var(--info-bg)] px-4 py-3.5">
      <div className="flex items-start gap-3">
        <div className="size-7 inline-flex items-center justify-center rounded-md bg-[color:var(--info)]/15 text-[color:var(--info)] shrink-0">
          <Sparkles size={14} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <div className="text-xs font-medium uppercase tracking-wide text-[color:var(--info)]">Análisis IA · Recomendación</div>
            <div className="font-mono text-[10px] text-text-tertiary">{analysis.engineVersion}</div>
          </div>
          <div className="mt-1 text-base font-medium text-text">
            {analysis.recommendationLabel || REC_LABEL[analysis.recommendation]}
          </div>
          <div className="mt-1.5 text-sm text-text-secondary leading-relaxed">{analysis.reasoning}</div>
          <div className="mt-2 text-[11px] text-text-tertiary">Generado el {formatDateTime(analysis.generatedAt)}</div>
        </div>
      </div>
    </div>
  );
}
