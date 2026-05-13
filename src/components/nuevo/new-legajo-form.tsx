"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildChecklist, checklistSummary } from "@/lib/checklist-engine";
import type { EntityScope } from "@/lib/types";
import { cn } from "@/lib/utils";

const ENTITIES: { value: EntityScope; title: string; desc: string }[] = [
  { value: "PSAV", title: "Eluter SA · PSAV", desc: "Proveedor de servicios de activos virtuales (Argentina). UBO 10%." },
  { value: "PSP", title: "ArgyPay SA · PSP", desc: "Proveedor de servicios de pago con CVU (Argentina). BCRA Reg. N° 34.677." },
  { value: "MSB", title: "ADBLIDAI LLC · MSB", desc: "Money Services Business (US). FinCEN Reg. N° 31000273040866. UBO 25% + Control Person." },
];

const CLIENT_TYPES = [
  "empresa_argentina",
  "empresa_us_llc",
  "empresa_us_corp",
  "fintech",
  "broker",
  "comercio",
  "exchange",
  "productora",
  "sociedad_de_bolsa",
  "importador_exportador",
  "remittance",
  "otro",
] as const;

export function NewLegajoForm() {
  const router = useRouter();
  const [entityScope, setEntityScope] = useState<EntityScope>("PSAV");
  const [legalName, setLegalName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [country, setCountry] = useState("Argentina");
  const [corporateForm, setCorporateForm] = useState("");
  const [clientType, setClientType] = useState<typeof CLIENT_TYPES[number]>("empresa_argentina");
  const [requestedService, setRequestedService] = useState("");
  const [volume, setVolume] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checklist = useMemo(
    () => buildChecklist({ entityScope, clientType, countryOfIncorporation: country, requestedService }),
    [entityScope, clientType, country, requestedService]
  );
  const sum = checklistSummary(checklist);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/legajos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientLegalName: legalName,
          taxId,
          countryOfIncorporation: country,
          entityScope,
          clientType,
          corporateForm,
          requestedService,
          expectedMonthlyVolume: volume,
          primaryContact: contactName,
          primaryContactEmail: contactEmail,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      const { legajo } = (await res.json()) as { legajo: { id: string } };
      router.push(`/legajos/${legajo.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader title="Entidad reguladora aplicable" description="Define el marco regulatorio y el set de documentación obligatoria" />
          <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ENTITIES.map((e) => {
              const active = entityScope === e.value;
              return (
                <button
                  type="button"
                  key={e.value}
                  onClick={() => setEntityScope(e.value)}
                  className={cn(
                    "text-left rounded-md border px-3 py-3 transition-colors",
                    active
                      ? "border-[color:var(--accent)] bg-[color:var(--accent)]/5"
                      : "border-[color:var(--border)] hover:border-[color:var(--accent)]/40"
                  )}
                >
                  <div className="text-sm font-medium text-text">{e.title}</div>
                  <div className="text-[11px] text-text-tertiary mt-1 leading-snug">{e.desc}</div>
                </button>
              );
            })}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Datos del cliente" />
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Razón social *">
              <Input value={legalName} onChange={setLegalName} placeholder="Acme SRL" required />
            </Field>
            <Field label="Tax ID (CUIT / EIN) *">
              <Input value={taxId} onChange={setTaxId} placeholder="30-71945823-6" required />
            </Field>
            <Field label="País de constitución *">
              <Input value={country} onChange={setCountry} placeholder="Argentina" required />
            </Field>
            <Field label="Forma jurídica">
              <Input value={corporateForm} onChange={setCorporateForm} placeholder="SA · SAS · SRL · LLC · C-Corp" />
            </Field>
            <Field label="Tipo de cliente">
              <select
                value={clientType}
                onChange={(e) => setClientType(e.target.value as typeof CLIENT_TYPES[number])}
                className="h-9 w-full px-2.5 rounded-md border border-[color:var(--border)] bg-[color:var(--bg)] text-sm focus:outline-none focus:border-[color:var(--accent)]/50"
              >
                {CLIENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Servicio y volumen" />
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Servicio solicitado *">
              <Input value={requestedService} onChange={setRequestedService} placeholder="Cuenta de pago CVU / Custodia cripto / FBO" required />
            </Field>
            <Field label="Volumen estimado mensual">
              <Input value={volume} onChange={setVolume} placeholder="ARS 50M · USD 2.5M" />
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Contacto principal" />
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Nombre *">
              <Input value={contactName} onChange={setContactName} placeholder="Lucía Méndez" required />
            </Field>
            <Field label="Email *">
              <Input value={contactEmail} onChange={setContactEmail} type="email" placeholder="lucia@empresa.com" required />
            </Field>
          </CardBody>
        </Card>

        <div className="flex items-center justify-end gap-3">
          {error && <span className="text-xs text-[color:var(--danger)] mr-auto">{error}</span>}
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Creando…" : "Crear legajo"}
          </Button>
        </div>
      </div>

      <aside className="space-y-4">
        <Card>
          <CardHeader
            title="Checklist preliminar"
            description={`${sum.mandatory} obligatorios · ${sum.recommended} recomendados`}
          />
          <CardBody className="space-y-2">
            {checklist.map((d) => (
              <div key={d.code} className="text-xs flex items-start justify-between gap-2 pb-2 border-b border-[color:var(--border)] last:border-b-0 last:pb-0">
                <div className="min-w-0">
                  <div className="text-text leading-tight">{d.label}</div>
                  <div className="text-[10px] text-text-tertiary mt-0.5 leading-snug">{d.reason}</div>
                </div>
                <span className={cn(
                  "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase",
                  d.isMandatory ? "bg-[color:var(--danger-bg)] text-[color:var(--danger)]" : "bg-[color:var(--bg-muted)] text-text-tertiary"
                )}>
                  {d.isMandatory ? "Obl." : "Rec."}
                </span>
              </div>
            ))}
          </CardBody>
        </Card>
      </aside>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wide text-text-tertiary mb-1">{label}</span>
      {children}
    </label>
  );
}

function Input({ value, onChange, ...rest }: { value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <input
      {...rest}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full px-2.5 rounded-md border border-[color:var(--border)] bg-[color:var(--bg)] text-sm focus:outline-none focus:border-[color:var(--accent)]/50"
    />
  );
}
