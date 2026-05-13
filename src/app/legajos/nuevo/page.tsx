import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { NewLegajoForm } from "@/components/nuevo/new-legajo-form";

export default function NewLegajoPage() {
  return (
    <div className="px-6 py-6 max-w-[1320px] mx-auto space-y-5">
      <nav className="flex items-center gap-1 text-xs text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/legajos" className="hover:text-text-secondary">Legajos</Link>
        <ChevronRight size={12} />
        <span className="text-text-secondary">Nuevo</span>
      </nav>

      <header>
        <h1 className="text-2xl font-medium text-text leading-tight">Nuevo legajo</h1>
        <p className="text-sm text-text-tertiary mt-1">
          Alta inicial de un cliente bajo cualquiera de las tres entidades reguladas.
        </p>
      </header>

      <NewLegajoForm />
    </div>
  );
}
