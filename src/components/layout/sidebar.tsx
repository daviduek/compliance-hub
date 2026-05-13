import Link from "next/link";
import { LayoutDashboard, FolderKanban, ListChecks, BarChart3, BookOpen, Settings, ChevronsUpDown } from "lucide-react";

const NAV = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/legajos", icon: FolderKanban, label: "Legajos" },
  { href: "/legajos?queue=1", icon: ListChecks, label: "Cola de revisión" },
  { href: "#", icon: BarChart3, label: "Reportes" },
  { href: "#", icon: BookOpen, label: "Manuales" },
  { href: "#", icon: Settings, label: "Configuración" },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-[240px] shrink-0 flex-col border-r border-[color:var(--border)] bg-[color:var(--bg-muted)]/60">
      <div className="px-4 pt-5 pb-4">
        <div className="text-[15px] font-medium text-text leading-tight">Compliance Hub</div>
        <div className="mt-0.5 font-mono text-[11px] text-text-tertiary">v1.4.2 · interno</div>
      </div>

      <nav className="px-2 mt-1 flex-1">
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-text-secondary hover:bg-[color:var(--bg-elevated)] hover:text-text transition-colors"
                >
                  <Icon size={15} className="opacity-80" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 pb-4">
        <div className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary mb-1.5">Entidad activa</div>
        <button className="w-full flex items-center justify-between gap-2 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--bg-elevated)] px-2.5 py-2 text-left text-xs hover:border-[color:var(--accent)]/40 transition-colors">
          <div className="min-w-0">
            <div className="font-medium text-text leading-tight">Eluter SA</div>
            <div className="font-mono text-[10px] text-text-tertiary mt-0.5">PSAV · Argentina</div>
          </div>
          <ChevronsUpDown size={13} className="text-text-tertiary shrink-0" />
        </button>

        <div className="mt-3 flex items-center gap-2 px-1">
          <div className="size-7 rounded-full bg-[color:var(--accent)] text-white flex items-center justify-center text-[11px] font-medium">MA</div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-text leading-tight truncate">María Álvarez</div>
            <div className="text-[10px] text-text-tertiary mt-0.5">Analista de compliance</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
