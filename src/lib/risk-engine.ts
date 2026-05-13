import type { EntityScope, Legajo, RedFlag, RiskBand, RiskBreakdown } from './types';

export const RISK_WEIGHTS = {
  jurisdictional: 0.12,
  activity: 0.14,
  documental: 0.12,
  corporate: 0.10,
  transactional: 0.08,
  crypto: 0.10,
  reputational: 0.08,
  volume: 0.08,
  inconsistency: 0.10,
  uboPep: 0.08,
} as const;

export const HARD_OVERRIDE_FLAGS = new Set([
  'OFAC_MATCH',
  'DOCUMENTACION_FALSIFICADA',
  'ACTIVIDAD_PROHIBIDA_TYC',
]);

export interface RiskInput {
  breakdown: RiskBreakdown;
  entityScope: EntityScope;
  redFlags?: RedFlag[];
}

export interface RiskResult {
  score: number;
  band: RiskBand;
  breakdown: RiskBreakdown;
  hardOverride: boolean;
  overrideReason?: string;
}

export function computeRisk(input: RiskInput): RiskResult {
  const { breakdown, entityScope, redFlags = [] } = input;

  // Hard overrides → automatically critico
  const triggered = redFlags.find((f) => HARD_OVERRIDE_FLAGS.has(f.code));
  if (triggered) {
    const fallbackScore = Math.max(weightedScore(breakdown, entityScope), 85);
    return {
      score: fallbackScore,
      band: 'critico',
      breakdown,
      hardOverride: true,
      overrideReason: triggered.title,
    };
  }

  const score = weightedScore(breakdown, entityScope);
  return {
    score,
    band: bandFor(score),
    breakdown,
    hardOverride: false,
  };
}

function weightedScore(b: RiskBreakdown, entityScope: EntityScope): number {
  let total = 0;
  let weightSum = 0;

  const entries = Object.entries(RISK_WEIGHTS) as Array<[keyof typeof RISK_WEIGHTS, number]>;
  for (const [key, w] of entries) {
    if (key === 'crypto' && entityScope !== 'PSAV') continue;
    total += b[key] * w;
    weightSum += w;
  }

  return Math.round(total / weightSum);
}

export function bandFor(score: number): RiskBand {
  if (score <= 25) return 'bajo';
  if (score <= 55) return 'medio';
  if (score <= 80) return 'alto';
  return 'critico';
}

export function explainRisk(legajo: Legajo): string[] {
  const reasons: string[] = [];
  const b = legajo.riskBreakdown;

  if (legajo.redFlags.some((f) => f.code === 'OFAC_MATCH')) {
    reasons.push('Match positivo en lista OFAC SDN — override automático a riesgo crítico.');
  }
  if (legajo.redFlags.some((f) => f.code === 'DOCUMENTACION_FALSIFICADA')) {
    reasons.push('Documentación falsificada detectada — override automático a riesgo crítico.');
  }
  if (legajo.redFlags.some((f) => f.code === 'ACTIVIDAD_PROHIBIDA_TYC')) {
    reasons.push('Actividad declarada en lista de prohibidas T&C — override automático.');
  }
  if (legajo.corporateForm === 'SAS' && legajo.entityScope === 'PSAV') {
    reasons.push('Estructura SAS — categoría de mayor riesgo según Manual Eluter Cap. VII.F.2.f.');
  }
  if (b.jurisdictional >= 50) {
    reasons.push('Riesgo jurisdiccional elevado por presencia de UBOs o contrapartes en jurisdicciones offshore o GAFI gris.');
  }
  if (b.activity >= 60) {
    reasons.push('Actividad declarada de riesgo intrínseco elevado (PSAV, exchange, remittance o cash-intensive).');
  }
  if (b.documental >= 50) {
    reasons.push('Documentación incompleta o con observaciones materiales.');
  }
  if (b.corporate >= 60) {
    reasons.push('Estructura societaria compleja o con vehículos opacos.');
  }
  if (b.volume >= 60) {
    reasons.push('Volumen declarado desproporcionado vs. antigüedad o documentación de respaldo.');
  }
  if (b.inconsistency >= 60) {
    reasons.push('Inconsistencias detectadas entre actividad declarada, estatuto y código AFIP.');
  }
  if (b.uboPep >= 50) {
    reasons.push('UBO PEP identificado — requiere Debida Diligencia Reforzada.');
  }
  if (legajo.entityScope === 'PSAV' && b.crypto >= 60) {
    reasons.push('Servicio cripto con perfil de exposición elevado (P2P, custodia, conversión fiat).');
  }

  if (reasons.length === 0) {
    reasons.push('Perfil de riesgo bajo. Documentación completa y consistente, sin red flags materiales.');
  }
  return reasons;
}

export function bandLabel(band: RiskBand): string {
  return { bajo: 'Bajo', medio: 'Medio', alto: 'Alto', critico: 'Crítico' }[band];
}

export function diligenceFor(band: RiskBand): string {
  return {
    bajo: 'Debida diligencia simplificada',
    medio: 'Debida diligencia común',
    alto: 'Debida diligencia reforzada',
    critico: 'Reforzada + elevación a Directorio',
  }[band];
}
