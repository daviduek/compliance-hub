import { Card } from "@/components/ui/card";
import { ALL_PROMPTS } from "@/lib/ai-prompts";
import type { Legajo } from "@/lib/types";

export function PromptsDebug({ legajo }: { legajo: Legajo }) {
  if (process.env.NEXT_PUBLIC_SHOW_PROMPTS !== "true") return null;
  return (
    <Card>
      <details>
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-text border-b border-[color:var(--border)] flex items-center justify-between">
          <span>Ver prompts internos (debug)</span>
          <span className="text-[11px] text-text-tertiary font-normal">NEXT_PUBLIC_SHOW_PROMPTS=true</span>
        </summary>
        <div className="px-4 py-3 space-y-3">
          {ALL_PROMPTS.map((p) => (
            <details key={p.name} className="rounded-md border border-[color:var(--border)]">
              <summary className="cursor-pointer px-3 py-2 text-sm font-medium">
                {p.name}
                <span className="ml-2 text-xs text-text-tertiary font-normal">{p.description}</span>
              </summary>
              <pre className="px-3 py-2 text-[11px] text-text-secondary leading-relaxed whitespace-pre-wrap font-mono bg-[color:var(--bg-muted)]/40 border-t border-[color:var(--border)] overflow-x-auto">
{p.build(legajo)}
              </pre>
            </details>
          ))}
        </div>
      </details>
    </Card>
  );
}
