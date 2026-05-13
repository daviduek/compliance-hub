"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck, RotateCcw, XCircle } from "lucide-react";

export function ActionBar() {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 mt-4 -mx-6 px-6 py-3 border-t border-[color:var(--border)] bg-[color:var(--bg-elevated)]/95 backdrop-blur">
      <div className="max-w-[1320px] mx-auto flex items-center justify-end gap-2">
        <Button variant="danger" onClick={() => alert("Rechazo registrado (demo)")}>
          <XCircle size={14} /> Rechazar
        </Button>
        <Button variant="warning" onClick={() => alert("Subsanación enviada (demo)")}>
          <RotateCcw size={14} /> Solicitar subsanación
        </Button>
        <Button variant="success" onClick={() => alert("Aprobado condicionado (demo)")}>
          <ShieldCheck size={14} /> Aprobar condicionado
        </Button>
        <Button variant="primary" onClick={() => alert("Aprobado (demo)")}>
          <CheckCircle2 size={14} /> Aprobar
        </Button>
      </div>
    </div>
  );
}
