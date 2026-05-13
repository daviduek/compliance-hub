import type {
  AIAnalysis,
  Authority,
  BeneficialOwner,
  ClientMessage,
  ClientType,
  Document,
  DocStatus,
  EntityScope,
  Legajo,
  LegajoState,
  RedFlag,
  RiskBreakdown,
} from "./types";
import { buildChecklist } from "./checklist-engine";
import { computeRisk } from "./risk-engine";
import { nextLegajoId } from "./storage";
import { RED_FLAGS_LIBRARY } from "./red-flags-library";

export interface LegajoInput {
  id?: string;
  clientLegalName: string;
  clientCommercialName?: string;
  taxId: string;
  countryOfIncorporation: string;
  countryFlag?: string;
  entityScope: EntityScope;
  clientType: ClientType;
  corporateForm: string;
  requestedService: string;
  declaredActivity?: string;
  expectedMonthlyVolume?: string;
  countriesInvolved?: string[];
  currenciesInvolved?: string[];
  website?: string;
  primaryContact: string;
  primaryContactEmail: string;
  assignedAnalyst?: string;
  complianceOfficer?: string;
  documents?: Array<Partial<Document> & { type: string; status?: DocStatus }>;
  beneficialOwners?: Array<Partial<BeneficialOwner> & { fullName: string; capitalPercentage: number }>;
  authorities?: Array<Partial<Authority> & { fullName: string; role: string }>;
  redFlagCodes?: string[];
  internalNotes?: string[];
  state?: LegajoState;
  /**
   * Manual breakdown override. If omitted, derived heuristically from inputs
   * so the deterministic engines still produce a coherent score.
   */
  riskBreakdown?: Partial<RiskBreakdown>;
}

function deriveBreakdown(input: LegajoInput, redFlagCodes: string[]): RiskBreakdown {
  const isPSAV = input.entityScope === "PSAV";
  const isSAS = input.corporateForm.toUpperCase() === "SAS";
  const country = input.countryOfIncorporation.toLowerCase();
  const offshoreCountries = ["bahamas", "cayman", "panama", "panamá", "bvi", "british virgin", "seychelles"];
  const gafiGray = ["russia", "rusia", "iran", "irán", "syria", "north korea"];
  const hasOffshoreUbo = (input.beneficialOwners ?? []).some((u) =>
    offshoreCountries.some((c) => (u.jurisdiction || "").toLowerCase().includes(c))
  );
  const hasPepUbo = (input.beneficialOwners ?? []).some((u) => u.isPep);
  const docs = input.documents ?? [];
  const missingMandatory = docs.filter((d) => d.status === "faltante_obligatorio").length;
  const ilegibleOrVencidos = docs.filter((d) => d.status === "vencido" || d.status === "ilegible" || d.status === "rechazado").length;

  const flagSet = new Set(redFlagCodes);
  const has = (code: string) => flagSet.has(code);

  const base: RiskBreakdown = {
    jurisdictional: 15
      + (gafiGray.some((c) => country.includes(c)) ? 60 : 0)
      + (hasOffshoreUbo ? 35 : 0)
      + ((input.countriesInvolved ?? []).some((c) => gafiGray.some((g) => c.toLowerCase().includes(g))) ? 30 : 0),
    activity: input.clientType === "exchange" || input.clientType === "remittance" ? 65
      : input.clientType === "fintech" ? 55
      : input.clientType === "broker" || input.clientType === "sociedad_de_bolsa" ? 45
      : 25,
    documental: 15 + missingMandatory * 12 + ilegibleOrVencidos * 18,
    corporate: 25 + (isSAS && isPSAV ? 30 : 0) + (hasOffshoreUbo ? 25 : 0),
    transactional: 30,
    crypto: isPSAV ? (input.clientType === "exchange" ? 75 : input.clientType === "fintech" ? 55 : 30) : 0,
    reputational: 20,
    volume: 25,
    inconsistency: 20 + (has("AFIP_CODE_MISMATCH") ? 35 : 0) + (has("OBJETO_SOCIAL_NO_ALINEADO") ? 35 : 0),
    uboPep: 20 + (hasPepUbo ? 50 : 0) + (hasOffshoreUbo ? 25 : 0),
  };

  // Apply caller overrides if provided
  return { ...base, ...(input.riskBreakdown ?? {}) } as RiskBreakdown;
}

function buildRedFlags(codes: string[], input: LegajoInput): RedFlag[] {
  return codes.flatMap((code, i) => {
    const def = RED_FLAGS_LIBRARY[code];
    if (!def) return [];
    const flag: RedFlag = {
      id: `rf${i + 1}`,
      code: def.code,
      level: def.level,
      title: def.title,
      description: def.title,
      whyItMatters: def.whyItMatters,
      whatToRequest: def.whatToRequest,
      evidenceDocIds: [],
      manualReference: def.manualReference,
      status: "abierta",
    };
    void input; // hook for future contextualization
    return [flag];
  });
}

function defaultDocsFromChecklist(input: LegajoInput): Document[] {
  const checklist = buildChecklist({
    entityScope: input.entityScope,
    clientType: input.clientType,
    countryOfIncorporation: input.countryOfIncorporation,
    requestedService: input.requestedService,
  });
  return checklist.map((d, i) => ({
    id: `d${i + 1}`,
    type: d.code,
    label: d.label,
    status: d.isMandatory ? "faltante_obligatorio" : "faltante_recomendado",
    isMandatory: d.isMandatory,
  }));
}

function normalizeDocuments(input: LegajoInput): Document[] {
  if (!input.documents || input.documents.length === 0) {
    return defaultDocsFromChecklist(input);
  }
  return input.documents.map((d, i) => ({
    id: d.id ?? `d${i + 1}`,
    type: d.type,
    label: d.label ?? d.type,
    filename: d.filename,
    status: (d.status ?? "recibido_revision") as DocStatus,
    issueDate: d.issueDate,
    expirationDate: d.expirationDate,
    observation: d.observation,
    isMandatory: d.isMandatory ?? true,
    hash: d.hash,
  }));
}

function normalizeUbos(input: LegajoInput): BeneficialOwner[] {
  return (input.beneficialOwners ?? []).map((u, i) => ({
    id: u.id ?? `u${i + 1}`,
    fullName: u.fullName,
    idType: u.idType ?? "DNI/Passport",
    idNumber: u.idNumber ?? "",
    nationality: u.nationality ?? "AR",
    capitalPercentage: u.capitalPercentage,
    votingPercentage: u.votingPercentage,
    controlMechanism: u.controlMechanism ?? "capital",
    isPep: u.isPep ?? false,
    pepDetail: u.pepDetail,
    jurisdiction: u.jurisdiction ?? input.countryOfIncorporation,
    indirectVia: u.indirectVia,
    evidenceDocIds: u.evidenceDocIds ?? [],
  }));
}

function normalizeAuthorities(input: LegajoInput): Authority[] {
  return (input.authorities ?? []).map((a, i) => ({
    id: a.id ?? `a${i + 1}`,
    fullName: a.fullName,
    role: a.role,
    appointmentDate: a.appointmentDate ?? new Date().toISOString().slice(0, 10),
    termExpiration: a.termExpiration,
    isPep: a.isPep ?? false,
    idNumber: a.idNumber,
  }));
}

function recommendationFor(band: string, missingMandatory: number, hasCritical: boolean): { rec: AIAnalysis["recommendation"]; label: string; reasoning: string } {
  if (hasCritical) {
    return {
      rec: "rechazar",
      label: "Rechazar",
      reasoning: "Override automático a riesgo crítico por regla dura del motor (OFAC / documentación falsificada / actividad prohibida). Se recomienda no avanzar con el onboarding y elevar al Oficial de Cumplimiento.",
    };
  }
  if (band === "critico" || band === "alto") {
    return {
      rec: missingMandatory > 0 ? "subsanacion" : "aprobar_condicionado",
      label: missingMandatory > 0 ? "Solicitar subsanación" : "Aprobar condicionado a DDR",
      reasoning: `Perfil de riesgo ${band}. ${missingMandatory > 0 ? `${missingMandatory} documento(s) obligatorio(s) pendiente(s).` : "Documentación completa."} Se sugiere Debida Diligencia Reforzada con monitoreo trimestral durante el primer año.`,
    };
  }
  if (band === "medio") {
    return {
      rec: missingMandatory > 0 ? "subsanacion" : "aprobar_condicionado",
      label: missingMandatory > 0 ? "Solicitar subsanación" : "Aprobar condicionado",
      reasoning: `Perfil de riesgo medio. ${missingMandatory > 0 ? `${missingMandatory} documento(s) obligatorio(s) pendiente(s).` : "Sin red flags materiales."} Debida Diligencia Común aplicable.`,
    };
  }
  return {
    rec: missingMandatory > 0 ? "subsanacion" : "aprobar",
    label: missingMandatory > 0 ? "Solicitar documentación faltante" : "Aprobar",
    reasoning: `Perfil de riesgo bajo. ${missingMandatory > 0 ? `${missingMandatory} documento(s) obligatorio(s) pendiente(s) — esperada aprobación directa una vez recibidos.` : "Documentación completa, sin red flags materiales. Aprobación directa con monitoreo simplificado."}`,
  };
}

function buildSuggestedMessage(input: LegajoInput, documents: Document[], openFlags: RedFlag[]): ClientMessage {
  const lang: "es" | "en" = input.entityScope === "MSB" ? "en" : "es";
  const missing = documents.filter((d) => d.status === "faltante_obligatorio" || d.status === "vencido" || d.status === "ilegible");
  if (lang === "en") {
    const items = missing.map((d) => `- ${d.label}`).concat(openFlags.map((f) => `- ${f.whatToRequest}`)).join("\n");
    return {
      language: "en",
      subject: `${input.clientLegalName} — Outstanding items for onboarding completion`,
      body: `Dear ${input.primaryContact.split(" ")[0]},

We are finalizing the onboarding review of ${input.clientLegalName} under ADBLIDAI LLC (MSB). Before we can proceed to approval, we need the following items:

${items}

Response window: 10 business days. Once received, the file will be reassessed.

Best regards,
${input.assignedAnalyst ?? "Compliance team"}
Compliance Analyst — ADBLIDAI LLC`,
    };
  }
  const items = missing.map((d, i) => `${i + 1}. ${d.label}.`).concat(openFlags.map((f, i) => `${missing.length + i + 1}. ${f.whatToRequest}`)).join("\n");
  const entityName = input.entityScope === "PSAV" ? "Eluter SA" : "ArgyPay SA";
  return {
    language: "es",
    subject: `${input.clientLegalName} — Documentación complementaria para finalizar onboarding`,
    body: `Estimad${input.primaryContact.endsWith("a") ? "a" : "o"} ${input.primaryContact.split(" ")[0]},

En el marco del proceso de alta de ${input.clientLegalName} como cliente de ${entityName}, necesitamos completar la siguiente documentación para avanzar con la revisión:

${items}

Plazo sugerido: 10 días hábiles. Quedamos a disposición ante cualquier consulta.

Saludos cordiales,
${input.assignedAnalyst ?? "Equipo de Compliance"}
${entityName}`,
  };
}

export function buildLegajo(input: LegajoInput): Legajo {
  const id = input.id ?? nextLegajoId();
  const now = new Date();
  const slaDueAt = new Date(now.getTime() + 10 * 86400000).toISOString();

  const redFlagCodes = input.redFlagCodes ?? [];
  const redFlags = buildRedFlags(redFlagCodes, input);
  const breakdown = deriveBreakdown(input, redFlagCodes);
  const documents = normalizeDocuments(input);
  const ubos = normalizeUbos(input);
  const authorities = normalizeAuthorities(input);

  const risk = computeRisk({ breakdown, entityScope: input.entityScope, redFlags });
  const missingMandatory = documents.filter((d) => d.status === "faltante_obligatorio").length;
  const hasCritical = redFlags.some((f) => f.level === "critica");
  const rec = recommendationFor(risk.band, missingMandatory, hasCritical);

  const aiAnalysis: AIAnalysis = {
    recommendation: rec.rec,
    recommendationLabel: rec.label,
    reasoning: rec.reasoning,
    generatedAt: now.toISOString(),
    engineVersion: "risk-engine v1.4.2",
  };

  const openFlags = redFlags.filter((f) => f.status === "abierta");
  const suggestedClientMessage = buildSuggestedMessage(input, documents, openFlags);

  const legajo: Legajo = {
    id,
    clientLegalName: input.clientLegalName,
    clientCommercialName: input.clientCommercialName,
    taxId: input.taxId,
    countryOfIncorporation: input.countryOfIncorporation,
    countryFlag: input.countryFlag ?? (input.countryOfIncorporation.toLowerCase().includes("argent") ? "AR" : input.countryOfIncorporation.toLowerCase().includes("united") ? "US" : "—"),
    entityScope: input.entityScope,
    clientType: input.clientType,
    corporateForm: input.corporateForm,
    requestedService: input.requestedService,
    declaredActivity: input.declaredActivity ?? input.requestedService,
    expectedMonthlyVolume: input.expectedMonthlyVolume ?? "—",
    countriesInvolved: input.countriesInvolved ?? [],
    currenciesInvolved: input.currenciesInvolved ?? [],
    website: input.website,
    primaryContact: input.primaryContact,
    primaryContactEmail: input.primaryContactEmail,
    state: input.state ?? (missingMandatory > 0 ? "faltan_documentos" : "en_revision_automatica"),
    riskBand: risk.band,
    riskScore: risk.score,
    riskBreakdown: breakdown,
    documents,
    beneficialOwners: ubos,
    authorities,
    redFlags,
    aiAnalysis,
    suggestedClientMessage,
    assignedAnalyst: input.assignedAnalyst ?? "—",
    complianceOfficer: input.complianceOfficer,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    slaDueAt,
    internalNotes: input.internalNotes ?? [],
  };

  return legajo;
}

export function reanalyze(legajo: Legajo): Legajo {
  const codes = legajo.redFlags.map((f) => f.code);
  const breakdown = deriveBreakdown(
    {
      ...legajo,
      countryFlag: legajo.countryFlag,
      countriesInvolved: legajo.countriesInvolved,
      currenciesInvolved: legajo.currenciesInvolved,
      assignedAnalyst: legajo.assignedAnalyst,
    } as LegajoInput,
    codes,
  );
  const risk = computeRisk({ breakdown, entityScope: legajo.entityScope, redFlags: legajo.redFlags });
  const missing = legajo.documents.filter((d) => d.status === "faltante_obligatorio").length;
  const hasCritical = legajo.redFlags.some((f) => f.level === "critica");
  const rec = recommendationFor(risk.band, missing, hasCritical);
  return {
    ...legajo,
    riskScore: risk.score,
    riskBand: risk.band,
    riskBreakdown: breakdown,
    aiAnalysis: {
      recommendation: rec.rec,
      recommendationLabel: rec.label,
      reasoning: rec.reasoning,
      generatedAt: new Date().toISOString(),
      engineVersion: "risk-engine v1.4.2",
    },
    updatedAt: new Date().toISOString(),
  };
}
