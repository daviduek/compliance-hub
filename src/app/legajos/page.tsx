import Link from "next/link";
import { LegajoList } from "@/components/legajos/legajo-list";
import { LEGAJOS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function LegajosPage() {
  return (
    <div className="px-6 py-6 max-w-[1320px] mx-auto space-y-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-text leading-tight">Legajos</h1>
          <p className="text-sm text-text-tertiary mt-1">
            Todos los legajos de onboarding bajo las tres entidades reguladas.
          </p>
        </div>
        <Link href="/legajos/nuevo">
          <Button variant="primary"><Plus size={14} /> Nuevo legajo</Button>
        </Link>
      </header>

      <LegajoList legajos={LEGAJOS} />
    </div>
  );
}
