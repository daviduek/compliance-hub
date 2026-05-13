import { NextResponse } from "next/server";
import { getById, upsert } from "@/lib/storage";
import { reanalyze } from "@/lib/legajo-factory";
import { getLegajo as getMockLegajo } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const existing = (await getById(id)) ?? getMockLegajo(id);
  if (!existing) return NextResponse.json({ error: "no encontrado" }, { status: 404 });

  // Simulated model latency for parity with the original stub
  await new Promise((r) => setTimeout(r, 600));
  const updated = reanalyze(existing);
  if (await getById(id)) await upsert(updated);
  return NextResponse.json({
    legajoId: updated.id,
    riskScore: updated.riskScore,
    riskBand: updated.riskBand,
    analysis: updated.aiAnalysis,
    legajo: updated,
  });
}
