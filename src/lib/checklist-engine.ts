import type { EntityScope, ClientType, RequiredDocument } from './types';

export interface ChecklistInput {
  entityScope: EntityScope;
  clientType: ClientType;
  countryOfIncorporation: string;
  requestedService: string;
}

const PSAV_AR_BASE: RequiredDocument[] = [
  { code: 'estatuto', label: 'Estatuto o contrato social vigente', isMandatory: true, reason: 'Acredita personería jurídica y objeto social', appliesTo: 'PJ argentina' },
  { code: 'acta_designacion_autoridades', label: 'Acta de designación de autoridades vigente', isMandatory: true, reason: 'Identifica representantes legales actuales', appliesTo: 'PJ argentina' },
  { code: 'dni_representantes', label: 'DNI / pasaporte de representantes legales', isMandatory: true, reason: 'Identificación obligatoria de quien firma', appliesTo: 'PJ argentina' },
  { code: 'dj_beneficiarios_finales', label: 'DJ Beneficiarios Finales (Anexo C, umbral 10%)', isMandatory: true, reason: 'Resolución UIF — umbral PSAV', appliesTo: 'Eluter SA (PSAV)' },
  { code: 'dj_pep_socios', label: 'DJ PEP de cada socio o UBO', isMandatory: true, reason: 'Debida diligencia regulatoria', appliesTo: 'PJ argentina' },
  { code: 'constancia_afip', label: 'Constancia AFIP con actividad económica', isMandatory: true, reason: 'Validación fiscal y de actividad', appliesTo: 'PJ argentina' },
  { code: 'aceptacion_tyc', label: 'Aceptación T&C y Política de Privacidad', isMandatory: true, reason: 'Vínculo contractual', appliesTo: 'PJ argentina' },
  { code: 'estados_contables', label: 'Estados contables', isMandatory: false, reason: 'Validación de capacidad operativa', appliesTo: 'PJ argentina' },
  { code: 'comprobante_domicilio', label: 'Comprobante de domicilio fiscal', isMandatory: false, reason: 'Refuerzo de identificación', appliesTo: 'PJ argentina' },
  { code: 'material_comercial', label: 'Material comercial / sitio web', isMandatory: false, reason: 'Validación de modelo de negocio', appliesTo: 'PJ argentina' },
];

const PSAV_US_BASE: RequiredDocument[] = [
  { code: 'articles_of_incorporation', label: 'Articles of Incorporation', isMandatory: true, reason: 'Constitución legal en US', appliesTo: 'LLC / Corp US' },
  { code: 'operating_agreement', label: 'Operating Agreement', isMandatory: true, reason: 'Reglas societarias internas', appliesTo: 'LLC US' },
  { code: 'ein_confirmation', label: 'EIN Confirmation Letter (IRS)', isMandatory: true, reason: 'Identificación tributaria federal', appliesTo: 'LLC / Corp US' },
  { code: 'dj_beneficiarios_finales', label: 'DJ Beneficiarios Finales (umbral 10%)', isMandatory: true, reason: 'Eluter aplica umbral 10% incluso a contrapartes US', appliesTo: 'Eluter SA (PSAV)' },
  { code: 'dj_pep_socios', label: 'DJ PEP de cada socio', isMandatory: true, reason: 'Debida diligencia regulatoria', appliesTo: 'LLC / Corp US' },
  { code: 'passport_representantes', label: 'Pasaporte de representantes legales', isMandatory: true, reason: 'Identificación', appliesTo: 'LLC / Corp US' },
  { code: 'comprobante_domicilio_us', label: 'Proof of address (US)', isMandatory: true, reason: 'Refuerzo de identificación', appliesTo: 'LLC / Corp US' },
  { code: 'financial_statements', label: 'Financial statements', isMandatory: false, reason: 'Validación de capacidad operativa', appliesTo: 'LLC / Corp US' },
  { code: 'good_standing_certificate', label: 'Certificate of Good Standing', isMandatory: false, reason: 'Vigencia societaria', appliesTo: 'LLC / Corp US' },
];

const PSP_AR_BASE: RequiredDocument[] = [
  { code: 'estatuto', label: 'Estatuto o contrato social vigente', isMandatory: true, reason: 'Acredita personería jurídica', appliesTo: 'PJ argentina' },
  { code: 'acta_designacion_autoridades', label: 'Acta de designación de autoridades', isMandatory: true, reason: 'Representantes legales actuales', appliesTo: 'PJ argentina' },
  { code: 'dni_representantes', label: 'DNI / pasaporte de representantes legales', isMandatory: true, reason: 'Identificación obligatoria', appliesTo: 'PJ argentina' },
  { code: 'dj_beneficiarios_finales', label: 'DJ Beneficiarios Finales (10%)', isMandatory: true, reason: 'Resolución UIF', appliesTo: 'ArgyPay SA (PSP)' },
  { code: 'dj_pep_socios', label: 'DJ PEP de cada socio o UBO', isMandatory: true, reason: 'Debida diligencia regulatoria', appliesTo: 'PJ argentina' },
  { code: 'constancia_afip', label: 'Constancia AFIP con actividad económica', isMandatory: true, reason: 'Validación fiscal y de actividad', appliesTo: 'PJ argentina' },
  { code: 'aceptacion_tyc_argypay', label: 'Aceptación T&C ArgyPay', isMandatory: true, reason: 'Vínculo contractual', appliesTo: 'PJ argentina' },
  { code: 'consentimiento_bcra_a7463', label: 'Consentimiento Com. BCRA A 7463', isMandatory: true, reason: 'Enrolamiento de cuenta a la vista al CVU', appliesTo: 'PSP con CVU' },
  { code: 'validacion_cvu_titular', label: 'Validación de titularidad del CVU', isMandatory: true, reason: 'Prevenir operación por cuenta de terceros', appliesTo: 'PSP con CVU' },
  { code: 'descripcion_modelo_negocio', label: 'Descripción del modelo de negocio', isMandatory: false, reason: 'Análisis de coherencia operativa', appliesTo: 'PJ argentina' },
  { code: 'facturas_clientes_finales', label: 'Facturas o muestras de clientes finales', isMandatory: false, reason: 'Validación de actividad', appliesTo: 'PJ argentina' },
  { code: 'sitio_web_snapshot', label: 'Captura de sitio web institucional', isMandatory: false, reason: 'Validación de modelo de negocio', appliesTo: 'PJ argentina' },
  { code: 'volumen_estimado_mensual', label: 'Declaración de volumen estimado mensual', isMandatory: false, reason: 'Calibración de monitoreo', appliesTo: 'PJ argentina' },
];

const MSB_US_BASE: RequiredDocument[] = [
  { code: 'articles_of_incorporation', label: 'Articles of Incorporation / Certificate of Formation', isMandatory: true, reason: 'Constitución legal en US', appliesTo: 'Entidad US' },
  { code: 'operating_agreement_or_bylaws', label: 'Operating Agreement / Bylaws', isMandatory: true, reason: 'Reglas societarias internas', appliesTo: 'Entidad US' },
  { code: 'ein_confirmation', label: 'EIN Confirmation Letter (IRS)', isMandatory: true, reason: 'Identificación tributaria federal', appliesTo: 'Entidad US' },
  { code: 'good_standing_certificate', label: 'Certificate of Good Standing', isMandatory: true, reason: 'Vigencia societaria', appliesTo: 'Entidad US' },
  { code: 'beneficial_ownership_certification', label: 'Beneficial Ownership Certification (umbral 25%)', isMandatory: true, reason: 'FinCEN Beneficial Ownership Rule', appliesTo: 'ADBLIDAI (MSB)' },
  { code: 'control_person_identification', label: 'Identificación del Control Person', isMandatory: true, reason: '31 CFR § 1010.230 — individuo con control significativo', appliesTo: 'ADBLIDAI (MSB)' },
  { code: 'dj_pep_sanctions', label: 'PEP & Sanctions self-declaration', isMandatory: true, reason: 'Debida diligencia OFAC/PATRIOT', appliesTo: 'ADBLIDAI (MSB)' },
  { code: 'w9_or_w8bene', label: 'W-9 (US) o W-8BEN-E (no-US)', isMandatory: true, reason: 'Status fiscal IRS', appliesTo: 'Entidad US o extranjera' },
  { code: 'business_model_description', label: 'Descripción del modelo de negocio', isMandatory: true, reason: 'Análisis de flujo de fondos FBO', appliesTo: 'ADBLIDAI (MSB)' },
  { code: 'flow_of_funds_description', label: 'Flow of funds esperado', isMandatory: true, reason: 'Calibración de monitoreo', appliesTo: 'ADBLIDAI (MSB)' },
  { code: 'independent_aml_audit', label: 'Auditoría AML independiente', isMandatory: false, reason: 'Recomendado para MSBs regulados', appliesTo: 'Cliente MSB' },
  { code: 'state_licenses', label: 'State money transmitter licenses', isMandatory: false, reason: 'Cumplimiento estatal', appliesTo: 'Cliente MSB' },
  { code: 'audited_financial_statements', label: 'Audited financial statements', isMandatory: false, reason: 'Capacidad operativa', appliesTo: 'Entidad US' },
  { code: 'client_ofac_policy', label: 'Política OFAC del cliente', isMandatory: false, reason: 'Verificación de programa downstream', appliesTo: 'Cliente MSB' },
];

export function buildChecklist(input: ChecklistInput): RequiredDocument[] {
  const { entityScope, clientType, countryOfIncorporation, requestedService } = input;

  if (entityScope === 'PSAV') {
    const isUS = countryOfIncorporation.toLowerCase().includes('united states') || countryOfIncorporation === 'US';
    const base = isUS ? [...PSAV_US_BASE] : [...PSAV_AR_BASE];
    if (!isUS && /cvu/i.test(requestedService)) {
      base.push({
        code: 'formulario_cvu',
        label: 'Formulario CVU completo',
        isMandatory: true,
        reason: 'Requerido cuando el servicio incluye CVU',
        appliesTo: 'PJ argentina',
      });
    }
    return base;
  }

  if (entityScope === 'PSP') {
    return [...PSP_AR_BASE];
  }

  // MSB
  const base = [...MSB_US_BASE];
  if (clientType === 'fintech' || clientType === 'broker' || clientType === 'exchange' || clientType === 'remittance') {
    base.push({
      code: 'aml_program_written',
      label: 'AML Program escrito (cliente MSB regulado)',
      isMandatory: true,
      reason: 'Cliente downstream regulado debe documentar su programa AML',
      appliesTo: 'Cliente MSB regulado',
    });
  }
  return base;
}

export function checklistSummary(checklist: RequiredDocument[]) {
  return {
    total: checklist.length,
    mandatory: checklist.filter((d) => d.isMandatory).length,
    recommended: checklist.filter((d) => !d.isMandatory).length,
  };
}
