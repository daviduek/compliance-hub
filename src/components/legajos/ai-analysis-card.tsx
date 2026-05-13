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
    <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] border-l-2 border-l-[color:var(--info)] px-4 py-3.5">
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-text-tertiary">
          <Sparkles size={12} className="text-[color:var(--info)]" />
          <span>Recomendación del motor</span>
          <span className="text-text-tertiary/70">· {analysis.engineVersion}</span>
        </div>
        <span className="text-[10px] text-text-tertiary">{formatDateTime(analysis.generatedAt)}</span>
      </div>
      <div className="mt-2 text-sm font-medium text-text">
        {analysis.recommendationLabel || REC_LABEL[analysis.recommendation]}
      </div>
      <div className="mt-1.5 text-xs text-text-secondary leading-relaxed">{analysis.reasoning}</div>
    </div>
  );
}
