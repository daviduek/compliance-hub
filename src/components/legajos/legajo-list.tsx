"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { EntityPill, RiskPill, StatePill } from "@/components/ui/pill";
import { Search } from "lucide-react";
import type { EntityScope, Legajo, RiskBand } from "@/lib/types";
import { daysFromNow } from "@/lib/format";
import { cn } from "@/lib/utils";

const ENTITY_OPTIONS: { value: EntityScope; label: string }[] = [
  { value: "PSAV", label: "PSAV" },
  { value: "PSP", label: "PSP" },
  { value: "MSB", label: "MSB" },
];

const RISK_OPTIONS: { value: RiskBand; label: string }[] = [
  { value: "bajo", label: "Bajo" },
  { value: "medio", label: "Medio" },
  { value: "alto", label: "Alto" },
  { value: "critico", label: "Crítico" },
];

export function LegajoList({ legajos }: { legajos: Legajo[] }) {
  const [entityFilter, setEntityFilter] = useState<Set<EntityScope>>(new Set());
  const [riskFilter, setRiskFilter] = useState<Set<RiskBand>>(new Set());
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const toggle = <T,>(set: Set<T>, value: T): Set<T> => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  const filtered = useMemo(() => {
    return legajos.filter((l) => {
      if (entityFilter.size > 0 && !entityFilter.has(l.entityScope)) return false;
      if (riskFilter.size > 0 && !riskFilter.has(l.riskBand)) return false;
      if (stateFilter !== "all" && l.state !== stateFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${l.clientLegalName} ${l.taxId} ${l.id} ${l.primaryContact}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [legajos, entityFilter, riskFilter, stateFilter, search]);

  return (
    <div className="space-y-4">
      <Card className="px-4 py-3 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[260px] flex-1">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por cliente, CUIT, EIN o ID"
              className="w-full h-8 pl-8 pr-3 rounded-md border border-[color:var(--border)] bg-[color:var(--bg)] text-sm placeholder:text-text-tertiary focus:outline-none focus:border-[color:var(--accent)]/50"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wide text-text-tertiary">Entidad</span>
            {ENTITY_OPTIONS.map((o) => {
              const active = entityFilter.has(o.value);
              return (
                <button
                  key={o.value}
                  onClick={() => setEntityFilter((s) => toggle(s, o.value))}
                  className={cn(
                    "h-7 px-2 rounded-md border text-xs font-medium transition-colors",
                    active
                      ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)]"
                      : "bg-[color:var(--bg-elevated)] border-[color:var(--border)] text-text-secondary hover:border-[color:var(--accent)]/40"
                  )}
                >
                  {o.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wide text-text-tertiary">Riesgo</span>
            {RISK_OPTIONS.map((o) => {
              const active = riskFilter.has(o.value);
              return (
                <button
                  key={o.value}
                  onClick={() => setRiskFilter((s) => toggle(s, o.value))}
                  className={cn(
                    "h-7 px-2 rounded-md border text-xs font-medium transition-colors",
                    active
                      ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)]"
                      : "bg-[color:var(--bg-elevated)] border-[color:var(--border)] text-text-secondary hover:border-[color:var(--accent)]/40"
                  )}
                >
                  {o.label}
                </button>
              );
            })}
          </div>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="h-7 px-2 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-xs text-text-secondary focus:outline-none focus:border-[color:var(--accent)]/50"
          >
            <option value="all">Todos los estados</option>
            <option value="borrador">Borrador</option>
            <option value="en_revision_automatica">Revisión automática</option>
            <option value="requiere_revision_humana">Revisión humana</option>
            <option value="faltan_documentos">Faltan documentos</option>
            <option value="subsanacion_solicitada">Subsanación solicitada</option>
            <option value="aprobado_condicionado">Aprobado condicionado</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>

          <div className="ml-auto text-xs text-text-tertiary font-mono tabular-nums">{filtered.length} / {legajos.length}</div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-text-tertiary border-b border-[color:var(--border)]">
                <th className="text-left font-medium px-4 py-2">Cliente</th>
                <th className="text-left font-medium px-2 py-2">Entidad</th>
                <th className="text-left font-medium px-2 py-2">País</th>
                <th className="text-left font-medium px-2 py-2">Servicio</th>
                <th className="text-left font-medium px-2 py-2">Riesgo</th>
                <th className="text-left font-medium px-2 py-2">Estado</th>
                <th className="text-left font-medium px-2 py-2">Analista</th>
                <th className="text-right font-medium px-4 py-2">SLA</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const days = daysFromNow(l.slaDueAt);
                const slaTone = days < 0 ? "text-[color:var(--danger)]" : days <= 2 ? "text-[color:var(--warning)]" : "text-text-secondary";
                return (
                  <tr key={l.id} className="border-b border-[color:var(--border)] last:border-b-0 hover:bg-[color:var(--bg-muted)]/40 transition-colors cursor-pointer">
                    <td className="px-4 py-2.5">
                      <Link href={`/legajos/${l.id}`} className="block">
                        <div className="font-medium text-text leading-tight">{l.clientLegalName}</div>
                        <div className="font-mono text-[11px] text-text-tertiary mt-0.5">{l.id} · {l.taxId}</div>
                      </Link>
                    </td>
                    <td className="px-2 py-2.5"><EntityPill scope={l.entityScope} /></td>
                    <td className="px-2 py-2.5 font-mono text-xs text-text-secondary">{l.countryFlag}</td>
                    <td className="px-2 py-2.5 text-xs text-text-secondary max-w-[220px] truncate">{l.requestedService}</td>
                    <td className="px-2 py-2.5"><RiskPill band={l.riskBand} score={l.riskScore} /></td>
                    <td className="px-2 py-2.5"><StatePill state={l.state} /></td>
                    <td className="px-2 py-2.5 text-xs text-text-secondary">{l.assignedAnalyst}</td>
                    <td className={`px-4 py-2.5 text-right font-mono tabular-nums text-xs ${slaTone}`}>
                      {days < 0 ? `${Math.abs(days)}d vencido` : `${days}d`}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-sm text-text-tertiary py-12">
                    No hay legajos que cumplan con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
