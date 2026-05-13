import Link from "next/link";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { EntityDistribution } from "@/components/dashboard/entity-distribution";
import { QueueTable } from "@/components/dashboard/queue-table";
import { LEGAJOS } from "@/lib/mock-data";
import { loadAll } from "@/lib/storage";
import { getMode } from "@/lib/mode";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const mode = getMode();
  const real = await loadAll();
  const legajos = mode === "real" ? real : [...real, ...LEGAJOS];

  return (
    <div className="px-6 py-6 max-w-[1320px] mx-auto space-y-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-text leading-tight">Panel de cumplimiento</h1>
          <p className="text-sm text-text-tertiary mt-1">
            Vista consolidada — Eluter SA (PSAV) · ArgyPay SA (PSP) · ADBLIDAI LLC (MSB) ·
            <span className={`ml-2 font-mono text-[11px] uppercase tracking-wide ${mode === "real" ? "text-[color:var(--success)]" : "text-text-tertiary"}`}>
              modo {mode}
            </span>
          </p>
        </div>
        <Link href="/legajos/nuevo">
          <Button variant="primary"><Plus size={14} /> Nuevo legajo</Button>
        </Link>
      </header>

      {legajos.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[color:var(--border-strong)] px-6 py-16 text-center">
          <div className="text-sm font-medium text-text">No hay legajos cargados</div>
          <div className="mt-1 text-xs text-text-tertiary">
            Estás en modo real. Creá uno con <code className="font-mono bg-[color:var(--bg-muted)] px-1 py-0.5 rounded">/legajos/nuevo</code> o vía <code className="font-mono bg-[color:var(--bg-muted)] px-1 py-0.5 rounded">POST /api/legajos</code>.
          </div>
        </div>
      ) : (
        <>
          <KpiStrip legajos={legajos} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <QueueTable legajos={legajos} />
            </div>
            <div>
              <EntityDistribution legajos={legajos} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
