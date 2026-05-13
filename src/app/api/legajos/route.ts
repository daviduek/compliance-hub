import { NextResponse } from "next/server";
import { LEGAJOS } from "@/lib/mock-data";
import { loadAll, upsert } from "@/lib/storage";
import { buildLegajo, type LegajoInput } from "@/lib/legajo-factory";
import { getMode } from "@/lib/mode";

export const dynamic = "force-dynamic";

export async function GET() {
  const mode = getMode();
  const real = await loadAll();
  const payload = mode === "real" ? real : [...real, ...LEGAJOS];
  return NextResponse.json({ mode, count: payload.length, legajos: payload });
}

export async function POST(req: Request) {
  let body: LegajoInput;
  try {
    body = (await req.json()) as LegajoInput;
  } catch {
    return NextResponse.json({ error: "Body inválido (esperado JSON)" }, { status: 400 });
  }

  const required: Array<keyof LegajoInput> = [
    "clientLegalName",
    "taxId",
    "countryOfIncorporation",
    "entityScope",
    "clientType",
    "corporateForm",
    "requestedService",
    "primaryContact",
    "primaryContactEmail",
  ];
  const missing = required.filter((k) => !body[k]);
  if (missing.length > 0) {
    return NextResponse.json({ error: "Campos faltantes", fields: missing }, { status: 400 });
  }
  if (!["PSAV", "PSP", "MSB"].includes(body.entityScope)) {
    return NextResponse.json({ error: "entityScope debe ser PSAV | PSP | MSB" }, { status: 400 });
  }

  const legajo = buildLegajo(body);
  await upsert(legajo);
  return NextResponse.json({ legajo }, { status: 201 });
}
