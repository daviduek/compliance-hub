import { NextResponse } from "next/server";
import { getLegajo } from "@/lib/mock-data";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const legajoId = typeof body.legajoId === "string" ? body.legajoId : null;

  if (!legajoId) {
    return NextResponse.json({ error: "legajoId requerido" }, { status: 400 });
  }

  const legajo = getLegajo(legajoId);
  if (!legajo) {
    return NextResponse.json({ error: "legajo no encontrado" }, { status: 404 });
  }

  // Simulate model latency
  await new Promise((r) => setTimeout(r, 800));

  return NextResponse.json({
    legajoId: legajo.id,
    analysis: legajo.aiAnalysis,
    riskScore: legajo.riskScore,
    riskBand: legajo.riskBand,
  });
}
