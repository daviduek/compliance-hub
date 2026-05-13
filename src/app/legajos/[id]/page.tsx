import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { getLegajo } from "@/lib/mock-data";
import { LegajoHeader } from "@/components/legajos/legajo-header";
import { StatStrip } from "@/components/legajos/stat-strip";
import { AIAnalysisCard } from "@/components/legajos/ai-analysis-card";
import { DocumentList } from "@/components/legajos/document-list";
import { RedFlagsList } from "@/components/legajos/red-flags-list";
import { ClientMessageCard } from "@/components/legajos/client-message-card";
import { ActionBar } from "@/components/legajos/action-bar";
import { Tabs, TabPlaceholder } from "@/components/legajos/tabs";
import { UboTree } from "@/components/legajos/ubo-tree";
import { RiskFactors } from "@/components/legajos/risk-factors";
import { PromptsDebug } from "@/components/legajos/prompts-debug";

export default async function LegajoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const legajo = getLegajo(id);
  if (!legajo) notFound();

  const uboThreshold = legajo.entityScope === "MSB" ? 25 : 10;
  const openFlags = legajo.redFlags.filter((f) => f.status === "abierta");

  return (
    <div className="px-6 py-5 max-w-[1320px] mx-auto pb-24">
      <nav className="flex items-center gap-1 text-xs text-text-tertiary mb-3">
        <Link href="/" className="hover:text-text-secondary">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/legajos" className="hover:text-text-secondary">Legajos</Link>
        <ChevronRight size={12} />
        <span className="font-mono text-text-secondary">{legajo.id}</span>
      </nav>

      <div className="space-y-4">
        <LegajoHeader legajo={legajo} />
        <StatStrip legajo={legajo} />
        <AIAnalysisCard analysis={legajo.aiAnalysis} />

        <Tabs
          tabs={[
            {
              id: "resumen",
              label: "Resumen",
              content: (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <DocumentList documents={legajo.documents} />
                    <RedFlagsList redFlags={openFlags} />
                  </div>
                  <RiskFactors legajo={legajo} />
                  <UboTree owners={legajo.beneficialOwners} authorities={legajo.authorities} uboThreshold={uboThreshold} />
                  <ClientMessageCard message={legajo.suggestedClientMessage} />
                  <PromptsDebug legajo={legajo} />
                </div>
              ),
            },
            { id: "docs", label: "Documentos", count: legajo.documents.length, content: <TabPlaceholder title="Vista detallada de documentos con histórico y diffs" /> },
            { id: "checklist", label: "Checklist", content: <TabPlaceholder title="Checklist regulatorio interactivo" /> },
            { id: "sociedad", label: "Sociedad & UBO", count: legajo.beneficialOwners.length, content: <TabPlaceholder title="Árbol societario interactivo con drill-down hasta personas humanas" /> },
            { id: "flags", label: "Red flags", count: legajo.redFlags.length, content: <TabPlaceholder title="Historial completo de red flags (abiertas, mitigadas, descartadas)" /> },
            { id: "historial", label: "Historial", content: <TabPlaceholder title="Línea de tiempo de eventos del legajo" /> },
          ]}
        />
      </div>

      <ActionBar />
    </div>
  );
}
