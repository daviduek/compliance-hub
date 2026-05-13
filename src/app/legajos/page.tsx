import Link from "next/link";
import { LegajoList } from "@/components/legajos/legajo-list";
import { LEGAJOS } from "@/lib/mock-data";
import { loadAll } from "@/lib/storage";
import { getMode } from "@/lib/mode";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LegajosPage() {
  const mode = getMode();
  const real = await loadAll();
  // In real mode show only legajos created via API/UI. In demo mode show mock + any real ones on top.
  const legajos = mode === "real" ? real : [...real, ...LEGAJOS];

  return (
    <div className="px-6 py-6 max-w-[1320px] mx-auto space-y-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-text leading-tight">Legajos</h1>
          <p className="text-sm text-text-tertiary mt-1">
            {mode === "real"
              ? `Legajos reales persistidos (${real.length}). Para datos de ejemplo usá modo demo.`
              : `Todos los legajos: ${real.length} reales + ${LEGAJOS.length} de ejemplo.`}
          </p>
        </div>
        <Link href="/legajos/nuevo">
          <Button variant="primary"><Plus size={14} /> Nuevo legajo</Button>
        </Link>
      </header>

      <LegajoList legajos={legajos} />
    </div>
  );
}
