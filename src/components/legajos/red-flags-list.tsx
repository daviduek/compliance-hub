import { Card, CardHeader } from "@/components/ui/card";
import type { RedFlag } from "@/lib/types";
import { AlertOctagon, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

const LEVEL_TONES: Record<RedFlag["level"], { badge: string; bar: string; label: string }> = {
  baja: { badge: "bg-[color:var(--bg-muted)] text-text-secondary", bar: "bg-[color:var(--text-tertiary)]", label: "Baja" },
  media: { badge: "bg-[color:var(--warning-bg)] text-[color:var(--warning)]", bar: "bg-[color:var(--warning)]", label: "Media" },
  alta: { badge: "bg-[color:var(--danger-bg)] text-[color:var(--danger)]", bar: "bg-[color:var(--danger)]", label: "Alta" },
  critica: { badge: "bg-[color:var(--danger)] text-white", bar: "bg-[color:var(--danger)]", label: "Crítica" },
};

export function RedFlagsList({ redFlags }: { redFlags: RedFlag[] }) {
  return (
    <Card>
      <CardHeader
        title="Red flags"
        description={redFlags.length === 0 ? "Sin red flags abiertas" : `${redFlags.length} ${redFlags.length === 1 ? "señalada" : "señaladas"}`}
        action={
          <span className="inline-flex items-center gap-1 text-xs text-text-tertiary">
            <Flag size={11} /> Catálogo interno
          </span>
        }
      />
      {redFlags.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-text-tertiary">
          Este legajo no presenta red flags activas.
        </div>
      ) : (
        <ul className="divide-y divide-[color:var(--border)]">
          {redFlags.map((f) => {
            const tone = LEVEL_TONES[f.level];
            return (
              <li key={f.id} className="px-4 py-3 flex gap-3">
                <div className={cn("w-1 self-stretch rounded-full shrink-0", tone.bar)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-medium text-text leading-snug">{f.title}</div>
                    <span className={cn("shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide", tone.badge)}>
                      {tone.label}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-text-secondary leading-relaxed">{f.description}</div>
                  <details className="mt-1.5 group">
                    <summary className="cursor-pointer text-[11px] text-[color:var(--accent)] hover:underline list-none inline-flex items-center gap-1">
                      <AlertOctagon size={10} /> Por qué importa y qué pedir
                    </summary>
                    <div className="mt-1.5 space-y-1 text-[11px] text-text-secondary leading-relaxed">
                      <div><span className="text-text-tertiary">Por qué: </span>{f.whyItMatters}</div>
                      <div><span className="text-text-tertiary">A solicitar: </span>{f.whatToRequest}</div>
                    </div>
                  </details>
                  <div className="mt-1.5 font-mono text-[10px] text-text-tertiary">{f.manualReference}</div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
