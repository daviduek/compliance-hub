import { NextResponse } from "next/server";
import { getById, upsert } from "@/lib/storage";
import { reanalyze } from "@/lib/legajo-factory";
import type { Document, DocStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

interface DocumentInput {
  id?: string;
  type: string;
  label?: string;
  filename?: string;
  status?: DocStatus;
  issueDate?: string;
  expirationDate?: string;
  observation?: string;
  isMandatory?: boolean;
  hash?: string;
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const legajo = await getById(id);
  if (!legajo) return NextResponse.json({ error: "no encontrado (solo legajos creados via API)" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as { documents?: DocumentInput[]; document?: DocumentInput } | null;
  if (!body) return NextResponse.json({ error: "body inválido" }, { status: 400 });
  const inputs: DocumentInput[] = body.documents ?? (body.document ? [body.document] : []);
  if (inputs.length === 0) return NextResponse.json({ error: "se requiere document o documents[]" }, { status: 400 });

  // Upsert by `type` if no id provided; otherwise by id.
  const next = [...legajo.documents];
  for (const d of inputs) {
    const matchIdx = d.id
      ? next.findIndex((x) => x.id === d.id)
      : next.findIndex((x) => x.type === d.type);
    const merged: Document = {
      id: d.id ?? (matchIdx >= 0 ? next[matchIdx].id : `d${next.length + 1}`),
      type: d.type,
      label: d.label ?? (matchIdx >= 0 ? next[matchIdx].label : d.type),
      filename: d.filename ?? next[matchIdx]?.filename,
      status: (d.status ?? next[matchIdx]?.status ?? "recibido_revision") as DocStatus,
      issueDate: d.issueDate ?? next[matchIdx]?.issueDate,
      expirationDate: d.expirationDate ?? next[matchIdx]?.expirationDate,
      observation: d.observation ?? next[matchIdx]?.observation,
      isMandatory: d.isMandatory ?? next[matchIdx]?.isMandatory ?? true,
      hash: d.hash ?? next[matchIdx]?.hash,
    };
    if (matchIdx >= 0) next[matchIdx] = merged;
    else next.push(merged);
  }

  const updated = reanalyze({ ...legajo, documents: next, updatedAt: new Date().toISOString() });
  await upsert(updated);
  return NextResponse.json({ legajo: updated });
}
