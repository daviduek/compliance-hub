import { Search, Bell, HelpCircle } from "lucide-react";
import { getMode } from "@/lib/mode";

export function Topbar() {
  const mode = getMode();
  return (
    <header className="h-12 shrink-0 border-b border-[color:var(--border)] bg-[color:var(--bg)] px-5 flex items-center gap-3 sticky top-0 z-10">
      <div className="flex-1 max-w-md relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar por cliente, CUIT, EIN o ID de legajo"
          className="w-full h-8 pl-8 pr-3 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-sm placeholder:text-text-tertiary focus:outline-none focus:border-[color:var(--accent)]/50"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span
          title={mode === "real" ? "Modo real: solo legajos persistidos vía API/UI" : "Modo demo: incluye 8 legajos de ejemplo"}
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
            mode === "real"
              ? "bg-[color:var(--success-bg)] text-[color:var(--success)] border-[color:var(--success)]/30"
              : "bg-[color:var(--bg-muted)] text-text-secondary border-[color:var(--border-strong)]"
          }`}
        >
          <span className="size-1.5 rounded-full bg-current opacity-70" />
          {mode === "real" ? "Modo real" : "Modo demo"}
        </span>
        <button className="size-8 inline-flex items-center justify-center rounded-md text-text-tertiary hover:bg-[color:var(--bg-muted)] hover:text-text-secondary transition-colors">
          <HelpCircle size={15} />
        </button>
        <button className="size-8 inline-flex items-center justify-center rounded-md text-text-tertiary hover:bg-[color:var(--bg-muted)] hover:text-text-secondary transition-colors relative">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[color:var(--danger)]" />
        </button>
        <div className="size-7 ml-1 rounded-full bg-[color:var(--accent)] text-white flex items-center justify-center text-[11px] font-medium">MA</div>
      </div>
    </header>
  );
}
