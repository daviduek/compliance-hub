export type EntityScope = 'PSAV' | 'PSP' | 'MSB';

export type ClientType =
  | 'empresa_argentina'
  | 'empresa_us_llc'
  | 'empresa_us_corp'
  | 'persona_humana'
  | 'fintech'
  | 'broker'
  | 'comercio'
  | 'exchange'
  | 'productora'
  | 'sociedad_de_bolsa'
  | 'importador_exportador'
  | 'remittance'
  | 'otro';

export type LegajoState =
  | 'borrador'
  | 'documentacion_cargada'
  | 'en_revision_automatica'
  | 'requiere_revision_humana'
  | 'faltan_documentos'
  | 'subsanacion_solicitada'
  | 'aprobado_condicionado'
  | 'aprobado'
  | 'rechazado'
  | 'archivado';

export type RiskBand = 'bajo' | 'medio' | 'alto' | 'critico';

export type DocStatus =
  | 'recibido_valido'
  | 'recibido_revision'
  | 'vencido'
  | 'ilegible'
  | 'rechazado'
  | 'faltante_obligatorio'
  | 'faltante_recomendado';

export interface Document {
  id: string;
  type: string;
  label: string;
  filename?: string;
  status: DocStatus;
  issueDate?: string;
  expirationDate?: string;
  observation?: string;
  isMandatory: boolean;
  hash?: string;
}

export interface BeneficialOwner {
  id: string;
  fullName: string;
  idType: string;
  idNumber: string;
  nationality: string;
  capitalPercentage: number;
  votingPercentage?: number;
  controlMechanism: 'capital' | 'voting' | 'other';
  isPep: boolean;
  pepDetail?: string;
  jurisdiction: string;
  indirectVia?: string;
  evidenceDocIds: string[];
}

export interface Authority {
  id: string;
  fullName: string;
  role: string;
  appointmentDate: string;
  termExpiration?: string;
  isPep: boolean;
  idNumber?: string;
}

export interface RedFlag {
  id: string;
  code: string;
  level: 'baja' | 'media' | 'alta' | 'critica';
  title: string;
  description: string;
  whyItMatters: string;
  whatToRequest: string;
  evidenceDocIds: string[];
  manualReference: string;
  status: 'abierta' | 'mitigada' | 'descartada';
}

export interface RiskBreakdown {
  jurisdictional: number;
  activity: number;
  documental: number;
  corporate: number;
  transactional: number;
  crypto: number;
  reputational: number;
  volume: number;
  inconsistency: number;
  uboPep: number;
}

export interface AIAnalysis {
  recommendation: 'aprobar' | 'aprobar_condicionado' | 'subsanacion' | 'rechazar';
  recommendationLabel: string;
  reasoning: string;
  generatedAt: string;
  engineVersion: string;
}

export interface ClientMessage {
  subject: string;
  body: string;
  language: 'es' | 'en';
}

export interface Legajo {
  id: string;
  clientLegalName: string;
  clientCommercialName?: string;
  taxId: string;
  countryOfIncorporation: string;
  countryFlag: string;
  entityScope: EntityScope;
  clientType: ClientType;
  corporateForm: string;
  requestedService: string;
  declaredActivity: string;
  expectedMonthlyVolume: string;
  countriesInvolved: string[];
  currenciesInvolved: string[];
  website?: string;
  primaryContact: string;
  primaryContactEmail: string;
  state: LegajoState;
  riskBand: RiskBand;
  riskScore: number;
  riskBreakdown: RiskBreakdown;
  documents: Document[];
  beneficialOwners: BeneficialOwner[];
  authorities: Authority[];
  redFlags: RedFlag[];
  aiAnalysis: AIAnalysis;
  suggestedClientMessage: ClientMessage;
  assignedAnalyst: string;
  complianceOfficer?: string;
  createdAt: string;
  updatedAt: string;
  slaDueAt: string;
  internalNotes: string[];
}

export interface RequiredDocument {
  code: string;
  label: string;
  isMandatory: boolean;
  reason: string;
  appliesTo: string;
}
