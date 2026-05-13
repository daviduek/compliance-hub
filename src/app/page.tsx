import Link from "next/link";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { EntityDistribution } from "@/components/dashboard/entity-distribution";
import { QueueTable } from "@/components/dashboard/queue-table";
import { LEGAJOS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="px-6 py-6 max-w-[1320px] mx-auto space-y-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-text leading-tight">Panel de cumplimiento</h1>
          <p className="text-sm text-text-tertiary mt-1">
            Vista consolidada — Eluter SA (PSAV) · ArgyPay SA (PSP) · ADBLIDAI LLC (MSB)
          </p>
        </div>
        <Link href="/legajos/nuevo">
          <Button variant="primary"><Plus size={14} /> Nuevo legajo</Button>
        </Link>
      </header>

      <KpiStrip legajos={LEGAJOS} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <QueueTable legajos={LEGAJOS} />
        </div>
        <div>
          <EntityDistribution legajos={LEGAJOS} />
        </div>
      </div>
    </div>
  );
}
