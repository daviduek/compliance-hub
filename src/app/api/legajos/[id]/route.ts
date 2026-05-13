import { NextResponse } from "next/server";
import { getById, remove, upsert } from "@/lib/storage";
import { getLegajo as getMockLegajo } from "@/lib/mock-data";
import { reanalyze } from "@/lib/legajo-factory";
import type { Legajo } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const real = await getById(id);
  const legajo = real ?? getMockLegajo(id) ?? null;
  if (!legajo) return NextResponse.json({ error: "no encontrado" }, { status: 404 });
  return NextResponse.json({ legajo, source: real ? "real" : "demo" });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const existing = await getById(id);
  if (!existing) return NextResponse.json({ error: "no encontrado (solo legajos creados via API)" }, { status: 404 });
  const patch = (await req.json().catch(() => ({}))) as Partial<Legajo>;
  const merged: Legajo = { ...existing, ...patch, id: existing.id, updatedAt: new Date().toISOString() };
  const reanalyzed = reanalyze(merged);
  await upsert(reanalyzed);
  return NextResponse.json({ legajo: reanalyzed });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const ok = await remove(id);
  if (!ok) return NextResponse.json({ error: "no encontrado o no eliminable" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
