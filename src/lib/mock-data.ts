import type { Legajo } from './types';

// Helper: build ISO date N days ago (from a fixed reference so build is deterministic).
const REF = new Date('2026-05-13T12:00:00Z');
const daysAgo = (n: number) => new Date(REF.getTime() - n * 86400000).toISOString();
const daysAhead = (n: number) => new Date(REF.getTime() + n * 86400000).toISOString();

export const LEGAJOS: Legajo[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. NODO CAPITAL SAS — PSAV (Eluter) — alto 67
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'LEG-2026-0418',
    clientLegalName: 'Nodo Capital SAS',
    clientCommercialName: 'Nodo Capital',
    taxId: '30-71945823-6',
    countryOfIncorporation: 'Argentina',
    countryFlag: 'AR',
    entityScope: 'PSAV',
    clientType: 'fintech',
    corporateForm: 'SAS',
    requestedService: 'Conversión fiat/cripto + custodia',
    declaredActivity: 'Procesamiento de operaciones de activos virtuales para clientes corporativos',
    expectedMonthlyVolume: 'ARS 180M',
    countriesInvolved: ['AR', 'UY'],
    currenciesInvolved: ['ARS', 'USDT', 'USDC', 'BTC'],
    website: 'https://nodocapital.ar',
    primaryContact: 'Lucía Méndez',
    primaryContactEmail: 'lucia.mendez@nodocapital.ar',
    state: 'requiere_revision_humana',
    riskBand: 'alto',
    riskScore: 67,
    riskBreakdown: {
      jurisdictional: 55, activity: 70, documental: 60, corporate: 75, transactional: 50,
      crypto: 70, reputational: 30, volume: 65, inconsistency: 70, uboPep: 60,
    },
    documents: [
      { id: 'd1', type: 'estatuto', label: 'Estatuto SAS', filename: 'nodo_estatuto_2024.pdf', status: 'recibido_revision', isMandatory: true, issueDate: '2024-03-12', observation: 'Objeto social no menciona explícitamente operaciones con activos virtuales', hash: '0x9af3' },
      { id: 'd2', type: 'acta_designacion_autoridades', label: 'Acta de designación de autoridades', filename: 'nodo_acta_dir_2025.pdf', status: 'recibido_valido', isMandatory: true, issueDate: '2025-04-18', expirationDate: '2027-04-18' },
      { id: 'd3', type: 'dj_beneficiarios_finales', label: 'DJ Beneficiarios Finales (Anexo C)', filename: 'nodo_djbf.pdf', status: 'recibido_revision', isMandatory: true, issueDate: '2026-03-21', observation: 'Declara 40% vía holding offshore — requiere extender hasta personas humanas' },
      { id: 'd4', type: 'dj_pep_socios', label: 'DJ PEP de socios', status: 'faltante_obligatorio', isMandatory: true },
      { id: 'd5', type: 'constancia_afip', label: 'Constancia AFIP', filename: 'nodo_afip.pdf', status: 'recibido_revision', isMandatory: true, issueDate: '2026-02-10', observation: 'Código 620900 (servicios informáticos) — no contempla activos virtuales' },
      { id: 'd6', type: 'dni_representantes', label: 'DNI de representantes', filename: 'nodo_dni.pdf', status: 'recibido_valido', isMandatory: true },
      { id: 'd7', type: 'estados_contables', label: 'Estados contables', status: 'faltante_obligatorio', isMandatory: true, observation: 'Sociedad de 14 meses — no presentó EECC' },
      { id: 'd8', type: 'aceptacion_tyc', label: 'Aceptación T&C', filename: 'nodo_tyc.pdf', status: 'recibido_valido', isMandatory: true },
      { id: 'd9', type: 'comprobante_domicilio', label: 'Comprobante de domicilio', status: 'faltante_recomendado', isMandatory: false },
    ],
    beneficialOwners: [
      { id: 'u1', fullName: 'Lucía Méndez', idType: 'DNI', idNumber: '32.118.445', nationality: 'AR', capitalPercentage: 30, controlMechanism: 'capital', isPep: false, jurisdiction: 'Argentina', evidenceDocIds: ['d3', 'd6'] },
      { id: 'u2', fullName: 'Federico Iturraspe', idType: 'DNI', idNumber: '28.554.901', nationality: 'AR', capitalPercentage: 30, controlMechanism: 'capital', isPep: false, jurisdiction: 'Argentina', evidenceDocIds: ['d3', 'd6'] },
      { id: 'u3', fullName: 'Trinity Holdings Ltd.', idType: 'Reg. Corp', idNumber: 'BS-198443', nationality: 'BS', capitalPercentage: 40, controlMechanism: 'capital', isPep: false, jurisdiction: 'Bahamas', indirectVia: 'Holding offshore', evidenceDocIds: ['d3'] },
    ],
    authorities: [
      { id: 'a1', fullName: 'Lucía Méndez', role: 'Presidente', appointmentDate: '2025-04-18', termExpiration: '2027-04-18', isPep: false, idNumber: '32.118.445' },
      { id: 'a2', fullName: 'Federico Iturraspe', role: 'Vicepresidente', appointmentDate: '2025-04-18', termExpiration: '2027-04-18', isPep: false, idNumber: '28.554.901' },
    ],
    redFlags: [
      { id: 'rf1', code: 'UBO_OFFSHORE_INDIRECT', level: 'alta', title: 'UBO indirecto en Bahamas vía Trinity Holdings Ltd.', description: 'Trinity Holdings Ltd. (Bahamas) ostenta 40% del capital. Requiere identificación de las personas humanas que ejercen control final.', whyItMatters: 'Las estructuras offshore son señaladas en el Manual Eluter Cap. VIII.G como factor de riesgo elevado por opacidad de control.', whatToRequest: 'DJ Beneficiarios Finales del holding hasta llegar a personas humanas + screening OFAC/ONU/RePET.', evidenceDocIds: ['d3'], manualReference: 'Manual Eluter Cap. VIII.G.1', status: 'abierta' },
      { id: 'rf2', code: 'OBJETO_SOCIAL_NO_ALINEADO', level: 'alta', title: 'Objeto social no contempla operaciones con activos virtuales', description: 'El estatuto declara objeto de "servicios informáticos y consultoría" — no respalda legalmente la operación PSAV solicitada.', whyItMatters: 'Si el objeto social no incluye la actividad, hay riesgo de actuación ultra vires.', whatToRequest: 'Acta de asamblea ampliando objeto social o nota legal del cliente.', evidenceDocIds: ['d1'], manualReference: 'Manual Eluter Cap. VI.C.3', status: 'abierta' },
      { id: 'rf3', code: 'SAS_ARGENTINA', level: 'alta', title: 'Estructura SAS', description: 'Sociedad por Acciones Simplificada — listada como categoría de mayor riesgo.', whyItMatters: 'Las SAS tienen menor exigencia documental al constituirse y mayor flexibilidad societaria.', whatToRequest: 'Documentación reforzada: EECC, descripción detallada del modelo de negocio.', evidenceDocIds: [], manualReference: 'Manual Eluter Cap. VII.F.2.f', status: 'abierta' },
      { id: 'rf4', code: 'AFIP_CODE_MISMATCH', level: 'media', title: 'Código de actividad AFIP inconsistente', description: 'Código 620900 (servicios informáticos) no coincide con la actividad declarada PSAV.', whyItMatters: 'Indica posible elusión fiscal o cambio de modelo no formalizado.', whatToRequest: 'Constancia AFIP actualizada o justificación.', evidenceDocIds: ['d5'], manualReference: 'Manual Eluter Cap. VI.D.2', status: 'abierta' },
      { id: 'rf5', code: 'VOLUMEN_VS_ACTIVIDAD', level: 'alta', title: 'Volumen ARS 180M con sociedad de 14 meses sin EECC', description: 'El volumen declarado es significativo para una sociedad de antigüedad reducida y sin estados contables presentados.', whyItMatters: 'Señal de posible operación de pase o por cuenta de terceros.', whatToRequest: 'EECC, flujos bancarios últimos 6 meses, declaración de no operar por cuenta de terceros.', evidenceDocIds: ['d7'], manualReference: 'Manual Eluter Cap. VIII.E.4', status: 'abierta' },
    ],
    aiAnalysis: {
      recommendation: 'subsanacion',
      recommendationLabel: 'Solicitar subsanación',
      reasoning: 'El legajo presenta perfil de riesgo alto (67) consistente con la combinación de estructura SAS, UBO indirecto offshore en Bahamas, objeto social no alineado y volumen declarado desproporcionado vs antigüedad. La recomendación es no rechazar pero suspender el alta hasta que el cliente subsane: identificación humana detrás de Trinity Holdings Ltd., ampliación del objeto social, presentación de EECC y rectificación del código AFIP. Una vez subsanados, reevaluar a banda alta con DDR.',
      generatedAt: daysAgo(2),
      engineVersion: 'risk-engine v1.4.2',
    },
    suggestedClientMessage: {
      language: 'es',
      subject: 'Nodo Capital SAS — Documentación complementaria para finalizar onboarding',
      body: `Estimada Lucía,

Llegamos a la instancia final de revisión de la solicitud de alta de Nodo Capital SAS como cliente bajo Eluter SA (PSAV). Antes de cursar la aprobación, necesitamos completar la siguiente documentación:

1. DJ de Beneficiarios Finales del holding Trinity Holdings Ltd. (Bahamas), extendida hasta identificar a las personas humanas que ejercen control final del 40% indirecto. Esto es requerimiento del Manual Cap. VIII.G por la naturaleza offshore de la estructura.

2. Acta de asamblea ampliando el objeto social del estatuto para incluir expresamente operaciones con activos virtuales, o, alternativamente, una nota legal de su asesor justificando el encuadre actual.

3. Estados contables del ejercicio cerrado más reciente. En caso de que la sociedad aún no los tenga formalizados, una declaración firmada con los flujos bancarios mensuales de los últimos seis meses sirve como alternativa.

4. Constancia AFIP actualizada con el código de actividad correspondiente a operaciones con activos virtuales, o justificación de por qué se mantiene el código 620900.

5. DJ PEP firmada por cada socio.

El plazo de respuesta es de 7 días hábiles. Una vez recibidos los documentos, el legajo se reevaluará y, de ser favorable, se aprobará bajo régimen de Debida Diligencia Reforzada con monitoreo continuo.

Quedo a disposición para cualquier consulta.

Saludos cordiales,
María Álvarez
Analista de Compliance — Eluter SA`,
    },
    assignedAnalyst: 'María Álvarez',
    complianceOfficer: 'Sebastián Roca',
    createdAt: daysAgo(8),
    updatedAt: daysAgo(2),
    slaDueAt: daysAhead(4),
    internalNotes: [
      'Cliente referido por Federico Iturraspe (cofundador).',
      'Pendiente: confirmar relación entre Trinity Holdings y los socios locales.',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. ANDES TRADING SA — PSAV (Eluter) — medio 42
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'LEG-2026-0419',
    clientLegalName: 'Andes Trading SA',
    taxId: '30-70845112-9',
    countryOfIncorporation: 'Argentina',
    countryFlag: 'AR',
    entityScope: 'PSAV',
    clientType: 'sociedad_de_bolsa',
    corporateForm: 'SA',
    requestedService: 'Tesorería cripto corporativa',
    declaredActivity: 'Sociedad de bolsa con mesa de tesorería en activos digitales',
    expectedMonthlyVolume: 'USD 850K',
    countriesInvolved: ['AR'],
    currenciesInvolved: ['ARS', 'USD', 'USDT', 'USDC'],
    website: 'https://andestrading.com.ar',
    primaryContact: 'Tomás Larralde',
    primaryContactEmail: 'tlarralde@andestrading.com.ar',
    state: 'en_revision_automatica',
    riskBand: 'medio',
    riskScore: 42,
    riskBreakdown: {
      jurisdictional: 25, activity: 55, documental: 30, corporate: 35, transactional: 40,
      crypto: 60, reputational: 25, volume: 40, inconsistency: 30, uboPep: 35,
    },
    documents: [
      { id: 'd1', type: 'estatuto', label: 'Estatuto SA', filename: 'andes_estatuto.pdf', status: 'recibido_valido', isMandatory: true, issueDate: '2012-08-04' },
      { id: 'd2', type: 'acta_designacion_autoridades', label: 'Acta de designación', filename: 'andes_acta.pdf', status: 'recibido_valido', isMandatory: true, issueDate: '2025-09-30' },
      { id: 'd3', type: 'dj_beneficiarios_finales', label: 'DJ Beneficiarios Finales', filename: 'andes_djbf.pdf', status: 'recibido_valido', isMandatory: true, issueDate: '2026-04-02' },
      { id: 'd4', type: 'dj_pep_socios', label: 'DJ PEP', filename: 'andes_djpep.pdf', status: 'recibido_valido', isMandatory: true },
      { id: 'd5', type: 'constancia_afip', label: 'Constancia AFIP', filename: 'andes_afip.pdf', status: 'recibido_valido', isMandatory: true },
      { id: 'd6', type: 'dni_representantes', label: 'DNI representantes', status: 'recibido_valido', isMandatory: true },
      { id: 'd7', type: 'estados_contables', label: 'EECC 2024', filename: 'andes_eecc_2024.pdf', status: 'recibido_valido', isMandatory: false },
      { id: 'd8', type: 'aceptacion_tyc', label: 'Aceptación T&C', status: 'recibido_valido', isMandatory: true },
    ],
    beneficialOwners: [
      { id: 'u1', fullName: 'Tomás Larralde', idType: 'DNI', idNumber: '24.118.733', nationality: 'AR', capitalPercentage: 55, controlMechanism: 'capital', isPep: false, jurisdiction: 'Argentina', evidenceDocIds: ['d3'] },
      { id: 'u2', fullName: 'Ines Larralde de Lazcano', idType: 'DNI', idNumber: '22.554.108', nationality: 'AR', capitalPercentage: 30, controlMechanism: 'capital', isPep: false, jurisdiction: 'Argentina', evidenceDocIds: ['d3'] },
      { id: 'u3', fullName: 'Pedro Lazcano', idType: 'DNI', idNumber: '30.118.005', nationality: 'AR', capitalPercentage: 15, controlMechanism: 'capital', isPep: false, jurisdiction: 'Argentina', evidenceDocIds: ['d3'] },
    ],
    authorities: [
      { id: 'a1', fullName: 'Tomás Larralde', role: 'Presidente', appointmentDate: '2025-09-30', termExpiration: '2028-09-30', isPep: false },
      { id: 'a2', fullName: 'Pedro Lazcano', role: 'Director suplente', appointmentDate: '2025-09-30', termExpiration: '2028-09-30', isPep: false },
    ],
    redFlags: [
      { id: 'rf1', code: 'P2P_CASH_INTENSIVE', level: 'media', title: 'Mesa de tesorería cripto — perfil de exposición elevado', description: 'Aunque la sociedad es regulada CNV, la operación cripto corporativa implica DDR según Manual Eluter.', whyItMatters: 'Servicios cripto son disparadores de DDR independientemente del perfil de cliente.', whatToRequest: 'Política interna de gestión de tesorería digital y controles de monitoreo.', evidenceDocIds: [], manualReference: 'Manual Eluter Cap. VII.F.2.a', status: 'abierta' },
      { id: 'rf2', code: 'VOLUMEN_VS_ACTIVIDAD', level: 'media', title: 'Volumen mensual a verificar contra EECC', description: 'USD 850K mensual debe contrastarse con flujos del último ejercicio.', whyItMatters: 'Calibración del umbral de monitoreo.', whatToRequest: 'Confirmación de flujos esperados por moneda.', evidenceDocIds: ['d7'], manualReference: 'Manual Eluter Cap. VIII.E.4', status: 'abierta' },
    ],
    aiAnalysis: {
      recommendation: 'aprobar_condicionado',
      recommendationLabel: 'Aprobar condicionado a DDR',
      reasoning: 'Sociedad de bolsa con trayectoria de 14 años, paquete documental completo y UBOs locales identificados. El servicio cripto justifica DDR pero no eleva el riesgo a alto. Recomendación: aprobar condicionado al establecimiento de límites operativos y monitoreo trimestral del primer año.',
      generatedAt: daysAgo(1),
      engineVersion: 'risk-engine v1.4.2',
    },
    suggestedClientMessage: {
      language: 'es',
      subject: 'Andes Trading SA — Confirmación de límites operativos',
      body: `Estimado Tomás,

El legajo de Andes Trading SA está prácticamente cerrado. Antes de emitir la aprobación final, necesitamos confirmar los límites operativos mensuales por moneda (USD, USDT, USDC) y el procedimiento interno de monitoreo de la mesa cripto.

Una vez recibida esa confirmación, emitiremos la aprobación condicionada con monitoreo trimestral durante el primer año.

Saludos cordiales,
María Álvarez
Analista de Compliance — Eluter SA`,
    },
    assignedAnalyst: 'María Álvarez',
    complianceOfficer: 'Sebastián Roca',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
    slaDueAt: daysAhead(7),
    internalNotes: ['Cliente con muy buena reputación en mercado de capitales.'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. TERRACOMMERCE SRL — PSP (ArgyPay) — medio 38 — aprobado_condicionado
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'LEG-2026-0420',
    clientLegalName: 'TerraCommerce SRL',
    taxId: '30-71885501-3',
    countryOfIncorporation: 'Argentina',
    countryFlag: 'AR',
    entityScope: 'PSP',
    clientType: 'comercio',
    corporateForm: 'SRL',
    requestedService: 'Cuenta de pago CVU para cobros e-commerce',
    declaredActivity: 'Comercio electrónico de productos para hogar',
    expectedMonthlyVolume: 'ARS 45M',
    countriesInvolved: ['AR'],
    currenciesInvolved: ['ARS'],
    website: 'https://terracommerce.ar',
    primaryContact: 'Sofía Ramos',
    primaryContactEmail: 'sofia@terracommerce.ar',
    state: 'aprobado_condicionado',
    riskBand: 'medio',
    riskScore: 38,
    riskBreakdown: {
      jurisdictional: 15, activity: 35, documental: 30, corporate: 25, transactional: 40,
      crypto: 0, reputational: 20, volume: 45, inconsistency: 30, uboPep: 20,
    },
    documents: [
      { id: 'd1', type: 'estatuto', label: 'Contrato social SRL', status: 'recibido_valido', isMandatory: true, issueDate: '2019-06-12' },
      { id: 'd2', type: 'acta_designacion_autoridades', label: 'Acta de gerencia', status: 'recibido_valido', isMandatory: true },
      { id: 'd3', type: 'dj_beneficiarios_finales', label: 'DJ Beneficiarios Finales', status: 'recibido_valido', isMandatory: true },
      { id: 'd4', type: 'dj_pep_socios', label: 'DJ PEP', status: 'recibido_valido', isMandatory: true },
      { id: 'd5', type: 'constancia_afip', label: 'Constancia AFIP', status: 'recibido_valido', isMandatory: true },
      { id: 'd6', type: 'aceptacion_tyc_argypay', label: 'Aceptación T&C ArgyPay', status: 'recibido_valido', isMandatory: true },
      { id: 'd7', type: 'consentimiento_bcra_a7463', label: 'Consentimiento BCRA A 7463', status: 'recibido_valido', isMandatory: true },
      { id: 'd8', type: 'validacion_cvu_titular', label: 'Validación CVU titular', status: 'recibido_revision', isMandatory: true, observation: 'CVU declarado pendiente de verificación con PSP origen' },
      { id: 'd9', type: 'descripcion_modelo_negocio', label: 'Modelo de negocio', status: 'recibido_valido', isMandatory: false },
    ],
    beneficialOwners: [
      { id: 'u1', fullName: 'Sofía Ramos', idType: 'DNI', idNumber: '34.221.090', nationality: 'AR', capitalPercentage: 70, controlMechanism: 'capital', isPep: false, jurisdiction: 'Argentina', evidenceDocIds: ['d3'] },
      { id: 'u2', fullName: 'Martín Esquivel', idType: 'DNI', idNumber: '33.118.554', nationality: 'AR', capitalPercentage: 30, controlMechanism: 'capital', isPep: false, jurisdiction: 'Argentina', evidenceDocIds: ['d3'] },
    ],
    authorities: [
      { id: 'a1', fullName: 'Sofía Ramos', role: 'Gerente', appointmentDate: '2024-01-15', isPep: false },
    ],
    redFlags: [
      { id: 'rf1', code: 'CVU_TITULAR_NO_VALIDADO', level: 'media', title: 'CVU declarado pendiente de validación', description: 'El CVU para acreditaciones declarado por el cliente aún no fue verificado contra el PSP de origen.', whyItMatters: 'Sin validación hay riesgo de operación por cuenta de terceros.', whatToRequest: 'Constancia de CVU emitida por el PSP con titularidad explícita.', evidenceDocIds: ['d8'], manualReference: 'Manual ArgyPay Cap. IV.A.2', status: 'mitigada' },
    ],
    aiAnalysis: {
      recommendation: 'aprobar_condicionado',
      recommendationLabel: 'Aprobar condicionado a validación CVU',
      reasoning: 'Comercio electrónico con trayectoria, documentación completa y socios locales sin red flags materiales. Único pendiente: confirmar titularidad del CVU declarado, ya gestionado con el PSP de origen. Recomendación: aprobar condicionado a recepción de la constancia, sin necesidad de subsanación adicional.',
      generatedAt: daysAgo(3),
      engineVersion: 'risk-engine v1.4.2',
    },
    suggestedClientMessage: {
      language: 'es',
      subject: 'TerraCommerce SRL — Aprobación condicionada',
      body: `Estimada Sofía,

TerraCommerce SRL fue aprobada condicionalmente como cliente ArgyPay. La activación de la cuenta de pago queda pendiente exclusivamente de la recepción de la constancia de titularidad del CVU declarado, en proceso con su PSP de origen.

Una vez recibida, activamos la cuenta dentro de las 24 horas hábiles.

Saludos,
María Álvarez
Analista de Compliance — ArgyPay SA`,
    },
    assignedAnalyst: 'Diego Bárcena',
    complianceOfficer: 'Sebastián Roca',
    createdAt: daysAgo(12),
    updatedAt: daysAgo(3),
    slaDueAt: daysAhead(2),
    internalNotes: ['Cliente referido por canal de partners.'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. BUENOS AIRES PRODUCTIONS SA — PSP (ArgyPay) — bajo 22 — faltan_documentos
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'LEG-2026-0421',
    clientLegalName: 'Buenos Aires Productions SA',
    taxId: '30-69885220-1',
    countryOfIncorporation: 'Argentina',
    countryFlag: 'AR',
    entityScope: 'PSP',
    clientType: 'productora',
    corporateForm: 'SA',
    requestedService: 'Cuenta de pago para cobros de servicios audiovisuales',
    declaredActivity: 'Productora audiovisual y de contenido',
    expectedMonthlyVolume: 'ARS 28M',
    countriesInvolved: ['AR'],
    currenciesInvolved: ['ARS'],
    primaryContact: 'Renata Vidal',
    primaryContactEmail: 'renata@baproductions.tv',
    state: 'faltan_documentos',
    riskBand: 'bajo',
    riskScore: 22,
    riskBreakdown: {
      jurisdictional: 10, activity: 20, documental: 45, corporate: 20, transactional: 15,
      crypto: 0, reputational: 15, volume: 20, inconsistency: 15, uboPep: 15,
    },
    documents: [
      { id: 'd1', type: 'estatuto', label: 'Estatuto SA', status: 'recibido_valido', isMandatory: true, issueDate: '2008-11-20' },
      { id: 'd2', type: 'acta_designacion_autoridades', label: 'Acta de designación', status: 'recibido_valido', isMandatory: true },
      { id: 'd3', type: 'dj_beneficiarios_finales', label: 'DJ Beneficiarios Finales', status: 'faltante_obligatorio', isMandatory: true },
      { id: 'd4', type: 'dj_pep_socios', label: 'DJ PEP', status: 'faltante_obligatorio', isMandatory: true },
      { id: 'd5', type: 'constancia_afip', label: 'Constancia AFIP', status: 'recibido_valido', isMandatory: true },
      { id: 'd6', type: 'aceptacion_tyc_argypay', label: 'Aceptación T&C', status: 'recibido_valido', isMandatory: true },
      { id: 'd7', type: 'consentimiento_bcra_a7463', label: 'Consentimiento BCRA A 7463', status: 'faltante_obligatorio', isMandatory: true },
      { id: 'd8', type: 'validacion_cvu_titular', label: 'Validación CVU', status: 'recibido_valido', isMandatory: true },
    ],
    beneficialOwners: [
      { id: 'u1', fullName: 'Renata Vidal', idType: 'DNI', idNumber: '26.118.554', nationality: 'AR', capitalPercentage: 60, controlMechanism: 'capital', isPep: false, jurisdiction: 'Argentina', evidenceDocIds: [] },
      { id: 'u2', fullName: 'Joaquín Vidal', idType: 'DNI', idNumber: '24.998.221', nationality: 'AR', capitalPercentage: 40, controlMechanism: 'capital', isPep: false, jurisdiction: 'Argentina', evidenceDocIds: [] },
    ],
    authorities: [
      { id: 'a1', fullName: 'Renata Vidal', role: 'Presidente', appointmentDate: '2024-08-12', isPep: false },
    ],
    redFlags: [],
    aiAnalysis: {
      recommendation: 'subsanacion',
      recommendationLabel: 'Solicitar documentación faltante',
      reasoning: 'Perfil de bajo riesgo (22). Sociedad consolidada con actividad coherente. Solo restan tres documentos obligatorios estándar (DJ BF, DJ PEP, Consentimiento BCRA A 7463). Una vez recibidos, aprobación directa esperada.',
      generatedAt: daysAgo(2),
      engineVersion: 'risk-engine v1.4.2',
    },
    suggestedClientMessage: {
      language: 'es',
      subject: 'Buenos Aires Productions SA — Documentación pendiente',
      body: `Estimada Renata,

Para completar el alta como cliente ArgyPay restan tres documentos:

1. DJ de Beneficiarios Finales firmada por la sociedad.
2. DJ PEP firmada por cada socio.
3. Aceptación del Consentimiento Com. BCRA A 7463 para enrolamiento de la cuenta a la vista al CVU.

Plazo de respuesta: 7 días hábiles. Con esos tres documentos quedamos en condiciones de aprobar la cuenta.

Saludos,
Diego Bárcena
Analista de Compliance — ArgyPay SA`,
    },
    assignedAnalyst: 'Diego Bárcena',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(2),
    slaDueAt: daysAhead(8),
    internalNotes: [],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. LIGHTHOUSE HOLDINGS LLC — MSB (ADBLIDAI) — alto 72
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'LEG-2026-0422',
    clientLegalName: 'Lighthouse Holdings LLC',
    taxId: '88-3344091',
    countryOfIncorporation: 'United States (Delaware)',
    countryFlag: 'US',
    entityScope: 'MSB',
    clientType: 'fintech',
    corporateForm: 'LLC',
    requestedService: 'FBO + Virtual Accounts para procesar pagos cross-border',
    declaredActivity: 'Plataforma de pagos B2B para empresas latinoamericanas con destino US',
    expectedMonthlyVolume: 'USD 2.4M',
    countriesInvolved: ['US', 'MX', 'CO', 'KY'],
    currenciesInvolved: ['USD'],
    website: 'https://lighthouse-holdings.io',
    primaryContact: 'Daniel Voss',
    primaryContactEmail: 'daniel@lighthouse-holdings.io',
    state: 'requiere_revision_humana',
    riskBand: 'alto',
    riskScore: 72,
    riskBreakdown: {
      jurisdictional: 65, activity: 70, documental: 55, corporate: 75, transactional: 60,
      crypto: 0, reputational: 40, volume: 60, inconsistency: 50, uboPep: 75,
    },
    documents: [
      { id: 'd1', type: 'articles_of_incorporation', label: 'Certificate of Formation (Delaware)', status: 'recibido_valido', isMandatory: true, issueDate: '2023-02-08' },
      { id: 'd2', type: 'operating_agreement_or_bylaws', label: 'Operating Agreement', status: 'recibido_revision', isMandatory: true, observation: 'No designa Control Person explícitamente' },
      { id: 'd3', type: 'ein_confirmation', label: 'EIN Confirmation', status: 'recibido_valido', isMandatory: true },
      { id: 'd4', type: 'good_standing_certificate', label: 'Certificate of Good Standing', status: 'recibido_valido', isMandatory: true, issueDate: '2026-01-22' },
      { id: 'd5', type: 'beneficial_ownership_certification', label: 'Beneficial Ownership Certification', status: 'recibido_revision', isMandatory: true, observation: 'UBO 30% reside en jurisdicción GAFI gris' },
      { id: 'd6', type: 'control_person_identification', label: 'Control Person ID', status: 'faltante_obligatorio', isMandatory: true },
      { id: 'd7', type: 'dj_pep_sanctions', label: 'PEP & Sanctions declaration', status: 'recibido_valido', isMandatory: true },
      { id: 'd8', type: 'w9_or_w8bene', label: 'W-8BEN-E (entidades extranjeras de UBOs)', status: 'faltante_obligatorio', isMandatory: true },
      { id: 'd9', type: 'business_model_description', label: 'Business model', status: 'recibido_valido', isMandatory: true },
      { id: 'd10', type: 'flow_of_funds_description', label: 'Flow of funds', status: 'recibido_revision', isMandatory: true, observation: 'Incluye Cayman Islands como jurisdicción de tránsito' },
      { id: 'd11', type: 'aml_program_written', label: 'AML Program escrito', status: 'recibido_revision', isMandatory: true, observation: 'Documento entregado, pendiente revisión de procedimientos sobre end-users' },
    ],
    beneficialOwners: [
      { id: 'u1', fullName: 'Daniel Voss', idType: 'Passport', idNumber: 'US-A0182334', nationality: 'US', capitalPercentage: 45, controlMechanism: 'capital', isPep: false, jurisdiction: 'United States', evidenceDocIds: ['d5'] },
      { id: 'u2', fullName: 'Marisol Carranza', idType: 'Passport', idNumber: 'KY-X09812', nationality: 'KY', capitalPercentage: 30, controlMechanism: 'capital', isPep: false, jurisdiction: 'Cayman Islands', evidenceDocIds: ['d5'] },
      { id: 'u3', fullName: 'Tristan Reeves', idType: 'Passport', idNumber: 'US-B7745119', nationality: 'US', capitalPercentage: 25, controlMechanism: 'capital', isPep: false, jurisdiction: 'United States', evidenceDocIds: ['d5'] },
    ],
    authorities: [
      { id: 'a1', fullName: 'Daniel Voss', role: 'Managing Member', appointmentDate: '2023-02-08', isPep: false },
    ],
    redFlags: [
      { id: 'rf1', code: 'CONTROL_PERSON_NO_IDENTIFICADO', level: 'alta', title: 'Control Person no designado en Operating Agreement', description: 'El Operating Agreement no identifica explícitamente al individuo con control significativo según 31 CFR § 1010.230.', whyItMatters: 'Sin Control Person, el legajo está regulatoriamente incompleto.', whatToRequest: 'Resolución del board designando Control Person + identificación gubernamental.', evidenceDocIds: ['d2'], manualReference: '31 CFR § 1010.230 · Manual ADBLIDAI Sec. 4.2', status: 'abierta' },
      { id: 'rf2', code: 'GAFI_GRAY_LIST', level: 'alta', title: 'UBO 30% en Cayman Islands', description: 'Marisol Carranza, UBO con 30%, reside en Cayman Islands — jurisdicción bajo monitoreo intensificado GAFI.', whyItMatters: 'Operar con UBOs en jurisdicciones del listado GAFI requiere DDR y screening adicional.', whatToRequest: 'Screening reforzado y justificación operativa del vínculo con Cayman.', evidenceDocIds: ['d5'], manualReference: 'Manual ADBLIDAI Sec. 4.5 · FATF Public Statements', status: 'abierta' },
      { id: 'rf3', code: 'W8_W9_FALTANTE', level: 'media', title: 'W-8BEN-E pendiente para UBO no-US', description: 'Marisol Carranza requiere W-8BEN-E firmada para certificar status fiscal.', whyItMatters: 'IRS exige certificación para operar bajo cumplimiento tributario US.', whatToRequest: 'W-8BEN-E firmada con vigencia menor a 3 años.', evidenceDocIds: ['d8'], manualReference: 'IRS W-8BEN-E Instructions', status: 'abierta' },
      { id: 'rf4', code: 'FBO_END_USERS_NO_DEFINIDOS', level: 'media', title: 'AML program pendiente de revisión sobre end-users', description: 'El programa AML provisto no detalla suficientemente el procedimiento sobre end-users de la plataforma.', whyItMatters: 'En el modelo FBO, el cliente downstream es responsable del KYC sobre sus end-users.', whatToRequest: 'Anexo al AML program detallando el procedimiento de identificación de end-users.', evidenceDocIds: ['d11'], manualReference: 'Manual ADBLIDAI Sec. 7.3', status: 'abierta' },
    ],
    aiAnalysis: {
      recommendation: 'subsanacion',
      recommendationLabel: 'Solicitar subsanación',
      reasoning: 'Perfil alto (72) determinado por la combinación de UBO en Cayman, Control Person no identificado, W-8BEN-E pendiente y AML program incompleto en la sección de end-users. La operación FBO es viable pero requiere completar identificación regulatoria antes de avanzar. Recomendación: subsanación con plazo extendido por la complejidad jurisdiccional.',
      generatedAt: daysAgo(1),
      engineVersion: 'risk-engine v1.4.2',
    },
    suggestedClientMessage: {
      language: 'en',
      subject: 'Lighthouse Holdings LLC — Outstanding items for onboarding completion',
      body: `Dear Daniel,

We are finalizing the onboarding review of Lighthouse Holdings LLC under ADBLIDAI LLC (MSB). Before we can proceed to approval, we need the following items:

1. Board resolution formally designating the Control Person under 31 CFR § 1010.230, together with government-issued ID of that individual.

2. Form W-8BEN-E signed by Marisol Carranza, dated within the last three years.

3. An addendum to your AML program detailing the end-user identification procedure under the FBO model. This is essential since downstream KYC is the client's responsibility, while we must validate the program.

4. A brief operational justification for the inclusion of Cayman Islands in the flow of funds, including counterparty banks involved.

Response window: 10 business days. Once received, the file will be reassessed under Enhanced Due Diligence and, if favorable, approved with quarterly monitoring during the first year.

Best regards,
María Álvarez
Compliance Analyst — ADBLIDAI LLC`,
    },
    assignedAnalyst: 'María Álvarez',
    complianceOfficer: 'Sebastián Roca',
    createdAt: daysAgo(14),
    updatedAt: daysAgo(1),
    slaDueAt: daysAhead(6),
    internalNotes: ['Cliente con potencial alto pero requiere DDR exhaustiva.'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. COAST REMIT CORP — MSB (ADBLIDAI) — medio 51 — subsanacion_solicitada
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'LEG-2026-0423',
    clientLegalName: 'Coast Remit Corp',
    taxId: '90-1845003',
    countryOfIncorporation: 'United States (Florida)',
    countryFlag: 'US',
    entityScope: 'MSB',
    clientType: 'remittance',
    corporateForm: 'C-Corp',
    requestedService: 'Remesas hacia Latam con liquidación en virtual accounts',
    declaredActivity: 'Money transmitter licenciado en 14 estados con foco LatAm',
    expectedMonthlyVolume: 'USD 1.8M',
    countriesInvolved: ['US', 'MX', 'GT', 'HN', 'SV'],
    currenciesInvolved: ['USD', 'MXN'],
    website: 'https://coastremit.com',
    primaryContact: 'Patricia Gallego',
    primaryContactEmail: 'pgallego@coastremit.com',
    state: 'subsanacion_solicitada',
    riskBand: 'medio',
    riskScore: 51,
    riskBreakdown: {
      jurisdictional: 40, activity: 60, documental: 50, corporate: 45, transactional: 55,
      crypto: 0, reputational: 35, volume: 55, inconsistency: 40, uboPep: 35,
    },
    documents: [
      { id: 'd1', type: 'articles_of_incorporation', label: 'Articles of Incorporation', status: 'recibido_valido', isMandatory: true, issueDate: '2019-05-12' },
      { id: 'd2', type: 'operating_agreement_or_bylaws', label: 'Bylaws', status: 'recibido_valido', isMandatory: true },
      { id: 'd3', type: 'ein_confirmation', label: 'EIN Confirmation', status: 'recibido_valido', isMandatory: true },
      { id: 'd4', type: 'good_standing_certificate', label: 'Certificate of Good Standing', status: 'recibido_valido', isMandatory: true },
      { id: 'd5', type: 'beneficial_ownership_certification', label: 'Beneficial Ownership', status: 'recibido_valido', isMandatory: true },
      { id: 'd6', type: 'control_person_identification', label: 'Control Person ID', status: 'recibido_valido', isMandatory: true },
      { id: 'd7', type: 'dj_pep_sanctions', label: 'PEP & Sanctions', status: 'recibido_valido', isMandatory: true },
      { id: 'd8', type: 'w9_or_w8bene', label: 'W-9', status: 'recibido_valido', isMandatory: true },
      { id: 'd9', type: 'business_model_description', label: 'Business model', status: 'recibido_valido', isMandatory: true },
      { id: 'd10', type: 'flow_of_funds_description', label: 'Flow of funds', status: 'recibido_valido', isMandatory: true },
      { id: 'd11', type: 'aml_program_written', label: 'AML Program escrito', status: 'faltante_obligatorio', isMandatory: true, observation: 'Cliente es MSB regulado — requiere AML program formal' },
      { id: 'd12', type: 'state_licenses', label: 'State money transmitter licenses', status: 'recibido_revision', isMandatory: false, observation: 'Faltan licencias de Texas y California' },
    ],
    beneficialOwners: [
      { id: 'u1', fullName: 'Patricia Gallego', idType: 'Passport', idNumber: 'US-C2118334', nationality: 'US', capitalPercentage: 60, controlMechanism: 'capital', isPep: false, jurisdiction: 'United States', evidenceDocIds: ['d5'] },
      { id: 'u2', fullName: 'Carlos Mendoza', idType: 'Passport', idNumber: 'US-D8845112', nationality: 'US', capitalPercentage: 40, controlMechanism: 'capital', isPep: false, jurisdiction: 'United States', evidenceDocIds: ['d5'] },
    ],
    authorities: [
      { id: 'a1', fullName: 'Patricia Gallego', role: 'CEO', appointmentDate: '2019-05-12', isPep: false },
      { id: 'a2', fullName: 'Carlos Mendoza', role: 'CFO', appointmentDate: '2019-05-12', isPep: false },
    ],
    redFlags: [
      { id: 'rf1', code: 'AML_PROGRAM_FALTANTE', level: 'alta', title: 'AML Program escrito faltante', description: 'Coast Remit es MSB regulado pero no presentó programa AML formal con designación de AML Officer.', whyItMatters: 'FinCEN requiere validar que el cliente cuenta con programa AML antes de operar.', whatToRequest: 'AML program, designación de AML Officer, resultado de la última auditoría independiente.', evidenceDocIds: ['d11'], manualReference: '31 CFR § 1022.210', status: 'abierta' },
      { id: 'rf2', code: 'FBO_END_USERS_NO_DEFINIDOS', level: 'media', title: 'Procedimiento sobre remitentes y beneficiarios pendiente', description: 'Falta detalle sobre identificación de remitentes y beneficiarios bajo el modelo de remesas.', whyItMatters: 'Bajo modelo FBO, el KYC de end-users es responsabilidad del cliente.', whatToRequest: 'Anexo al AML program describiendo el flujo de KYC sobre remitentes y beneficiarios.', evidenceDocIds: [], manualReference: 'Manual ADBLIDAI Sec. 7.3', status: 'abierta' },
    ],
    aiAnalysis: {
      recommendation: 'subsanacion',
      recommendationLabel: 'Subsanación en curso',
      reasoning: 'MSB regulado con UBOs locales identificados. El único bloqueante es la entrega del AML program formal del cliente, requerimiento ineludible para MSB downstream. Plazo de respuesta vence en 8 días.',
      generatedAt: daysAgo(4),
      engineVersion: 'risk-engine v1.4.2',
    },
    suggestedClientMessage: {
      language: 'en',
      subject: 'Coast Remit Corp — AML program required',
      body: `Dear Patricia,

To finalize Coast Remit Corp's onboarding under ADBLIDAI LLC we still require:

1. Your written AML program, including designation of AML Officer and most recent independent audit.
2. An addendum describing the KYC procedure for senders and beneficiaries under the FBO model.

These items are mandatory for regulated MSB downstream clients per 31 CFR § 1022.210.

Response window: 8 business days.

Best regards,
María Álvarez
Compliance Analyst — ADBLIDAI LLC`,
    },
    assignedAnalyst: 'María Álvarez',
    createdAt: daysAgo(18),
    updatedAt: daysAgo(4),
    slaDueAt: daysAhead(8),
    internalNotes: ['Cliente con buen historial reputacional, sólo bloqueo documental.'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 7. PAMPAS EXCHANGE SA — PSAV (Eluter) — critico 88 — rechazado
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'LEG-2026-0424',
    clientLegalName: 'Pampas Exchange SA',
    taxId: '30-71998234-2',
    countryOfIncorporation: 'Argentina',
    countryFlag: 'AR',
    entityScope: 'PSAV',
    clientType: 'exchange',
    corporateForm: 'SA',
    requestedService: 'Exchange cripto P2P + custodia',
    declaredActivity: 'Plataforma de intercambio peer-to-peer de activos virtuales',
    expectedMonthlyVolume: 'USD 12M',
    countriesInvolved: ['AR', 'PA', 'RU', 'IR'],
    currenciesInvolved: ['ARS', 'USD', 'USDT', 'BTC', 'XMR'],
    primaryContact: 'Ivan Petrov',
    primaryContactEmail: 'ipetrov@pampasex.io',
    state: 'rechazado',
    riskBand: 'critico',
    riskScore: 88,
    riskBreakdown: {
      jurisdictional: 95, activity: 90, documental: 85, corporate: 80, transactional: 90,
      crypto: 95, reputational: 90, volume: 85, inconsistency: 90, uboPep: 85,
    },
    documents: [
      { id: 'd1', type: 'estatuto', label: 'Estatuto SA', status: 'rechazado', isMandatory: true, observation: 'Acta de asamblea con firmas presuntamente apócrifas' },
      { id: 'd2', type: 'acta_designacion_autoridades', label: 'Acta de designación', status: 'rechazado', isMandatory: true, observation: 'Firmas inconsistentes con DNI de respaldo' },
      { id: 'd3', type: 'dj_beneficiarios_finales', label: 'DJ Beneficiarios Finales', status: 'recibido_revision', isMandatory: true },
      { id: 'd4', type: 'constancia_afip', label: 'Constancia AFIP', status: 'recibido_valido', isMandatory: true },
    ],
    beneficialOwners: [
      { id: 'u1', fullName: 'Ivan Petrov', idType: 'Passport', idNumber: 'RU-44-281904', nationality: 'RU', capitalPercentage: 50, controlMechanism: 'capital', isPep: false, jurisdiction: 'Russia', evidenceDocIds: ['d3'] },
      { id: 'u2', fullName: 'Sergei Volkov (OFAC SDN match)', idType: 'Passport', idNumber: 'RU-99-118445', nationality: 'RU', capitalPercentage: 30, controlMechanism: 'capital', isPep: false, jurisdiction: 'Russia', evidenceDocIds: ['d3'] },
      { id: 'u3', fullName: 'Acme Treuhand AG', idType: 'Reg. Corp', idNumber: 'PA-998-44', nationality: 'PA', capitalPercentage: 20, controlMechanism: 'capital', isPep: false, jurisdiction: 'Panamá', evidenceDocIds: ['d3'] },
    ],
    authorities: [
      { id: 'a1', fullName: 'Ivan Petrov', role: 'Presidente', appointmentDate: '2025-11-04', isPep: false },
    ],
    redFlags: [
      { id: 'rf1', code: 'OFAC_MATCH', level: 'critica', title: 'Match positivo OFAC SDN — Sergei Volkov', description: 'UBO con 30% del capital figura en la SDN List de OFAC.', whyItMatters: 'Toda relación con sujeto OFAC SDN es prohibida y sancionable.', whatToRequest: 'Rechazo inmediato. Elevación al Oficial de Cumplimiento. Evaluar ROS.', evidenceDocIds: ['d3'], manualReference: 'OFAC SDN List', status: 'abierta' },
      { id: 'rf2', code: 'DOCUMENTACION_FALSIFICADA', level: 'critica', title: 'Acta de designación con firmas presuntamente apócrifas', description: 'El cotejo de firmas del acta vs DNI presentado muestra inconsistencias materiales.', whyItMatters: 'Documentación apócrifa es causal de rechazo inmediato y posible ROS.', whatToRequest: 'Rechazo. Conservación del expediente. Elevación.', evidenceDocIds: ['d2'], manualReference: 'Manual Eluter Cap. XI.B', status: 'abierta' },
      { id: 'rf3', code: 'GAFI_GRAY_LIST', level: 'alta', title: 'Jurisdicciones de alto riesgo en flujo', description: 'Países involucrados incluyen Rusia e Irán — sujetos a sanciones y monitoreo GAFI.', whyItMatters: 'Operar con esas jurisdicciones está vedado o severamente restringido.', whatToRequest: 'N/A — legajo en rechazo.', evidenceDocIds: [], manualReference: 'FATF / OFAC', status: 'abierta' },
    ],
    aiAnalysis: {
      recommendation: 'rechazar',
      recommendationLabel: 'Rechazar',
      reasoning: 'Override automático a crítico por dos disparadores duros: match OFAC SDN sobre UBO con 30% y documentación societaria presuntamente falsificada. Adicionalmente, jurisdicciones del flujo (Rusia, Irán) son incompatibles con operación. Recomendación: rechazo, conservación del expediente y evaluación de Reporte de Operación Sospechosa.',
      generatedAt: daysAgo(9),
      engineVersion: 'risk-engine v1.4.2',
    },
    suggestedClientMessage: {
      language: 'es',
      subject: 'Pampas Exchange SA — Solicitud no aprobada',
      body: `Estimado Iván,

Le informamos que, luego de la revisión de cumplimiento, no estamos en condiciones de aprobar la solicitud de alta de Pampas Exchange SA como cliente de Eluter SA.

La decisión es definitiva. No se brindarán detalles adicionales por razones regulatorias.

Saludos cordiales,
Sebastián Roca
Oficial de Cumplimiento — Eluter SA`,
    },
    assignedAnalyst: 'María Álvarez',
    complianceOfficer: 'Sebastián Roca',
    createdAt: daysAgo(22),
    updatedAt: daysAgo(9),
    slaDueAt: daysAgo(2),
    internalNotes: [
      'Expediente conservado para eventual requerimiento UIF.',
      'Evaluar emisión de ROS — pendiente decisión del Oficial de Cumplimiento.',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 8. MENDOZA WINES IMPORTER SA — PSP (ArgyPay) — bajo 18 — aprobado
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'LEG-2026-0425',
    clientLegalName: 'Mendoza Wines Importer SA',
    taxId: '30-68554003-7',
    countryOfIncorporation: 'Argentina',
    countryFlag: 'AR',
    entityScope: 'PSP',
    clientType: 'importador_exportador',
    corporateForm: 'SA',
    requestedService: 'Cuenta de pago CVU para cobros de exportaciones',
    declaredActivity: 'Importador y exportador de vinos premium',
    expectedMonthlyVolume: 'ARS 65M',
    countriesInvolved: ['AR', 'BR', 'CL'],
    currenciesInvolved: ['ARS'],
    website: 'https://mendozawines.com.ar',
    primaryContact: 'Esteban Galíndez',
    primaryContactEmail: 'egalindez@mendozawines.com.ar',
    state: 'aprobado',
    riskBand: 'bajo',
    riskScore: 18,
    riskBreakdown: {
      jurisdictional: 12, activity: 18, documental: 10, corporate: 15, transactional: 18,
      crypto: 0, reputational: 10, volume: 18, inconsistency: 12, uboPep: 10,
    },
    documents: [
      { id: 'd1', type: 'estatuto', label: 'Estatuto SA', status: 'recibido_valido', isMandatory: true, issueDate: '1998-07-22' },
      { id: 'd2', type: 'acta_designacion_autoridades', label: 'Acta de designación', status: 'recibido_valido', isMandatory: true },
      { id: 'd3', type: 'dj_beneficiarios_finales', label: 'DJ Beneficiarios Finales', status: 'recibido_valido', isMandatory: true },
      { id: 'd4', type: 'dj_pep_socios', label: 'DJ PEP', status: 'recibido_valido', isMandatory: true },
      { id: 'd5', type: 'constancia_afip', label: 'Constancia AFIP', status: 'recibido_valido', isMandatory: true },
      { id: 'd6', type: 'aceptacion_tyc_argypay', label: 'Aceptación T&C', status: 'recibido_valido', isMandatory: true },
      { id: 'd7', type: 'consentimiento_bcra_a7463', label: 'Consentimiento BCRA A 7463', status: 'recibido_valido', isMandatory: true },
      { id: 'd8', type: 'validacion_cvu_titular', label: 'Validación CVU', status: 'recibido_valido', isMandatory: true },
      { id: 'd9', type: 'estados_contables', label: 'EECC 2024', status: 'recibido_valido', isMandatory: false },
    ],
    beneficialOwners: [
      { id: 'u1', fullName: 'Esteban Galíndez', idType: 'DNI', idNumber: '17.554.221', nationality: 'AR', capitalPercentage: 65, controlMechanism: 'capital', isPep: false, jurisdiction: 'Argentina', evidenceDocIds: ['d3'] },
      { id: 'u2', fullName: 'María Galíndez', idType: 'DNI', idNumber: '19.118.998', nationality: 'AR', capitalPercentage: 35, controlMechanism: 'capital', isPep: false, jurisdiction: 'Argentina', evidenceDocIds: ['d3'] },
    ],
    authorities: [
      { id: 'a1', fullName: 'Esteban Galíndez', role: 'Presidente', appointmentDate: '2023-04-12', isPep: false },
    ],
    redFlags: [],
    aiAnalysis: {
      recommendation: 'aprobar',
      recommendationLabel: 'Aprobar',
      reasoning: 'Perfil de riesgo bajo (18). Sociedad familiar consolidada con 28 años de trayectoria, actividad coherente con código AFIP, UBOs locales identificados, documentación completa y sin red flags materiales. Aprobación directa con régimen de monitoreo común.',
      generatedAt: daysAgo(11),
      engineVersion: 'risk-engine v1.4.2',
    },
    suggestedClientMessage: {
      language: 'es',
      subject: 'Mendoza Wines Importer SA — Aprobación de cuenta',
      body: `Estimado Esteban,

Tenemos el agrado de confirmar que Mendoza Wines Importer SA fue aprobada como cliente ArgyPay. La cuenta de pago con CVU asociado está activa y disponible para operar.

Cualquier consulta operativa puede dirigirla a nuestro equipo de soporte.

Saludos cordiales,
Diego Bárcena
Analista de Compliance — ArgyPay SA`,
    },
    assignedAnalyst: 'Diego Bárcena',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(11),
    slaDueAt: daysAgo(5),
    internalNotes: [],
  },
];

export function getLegajo(id: string): Legajo | undefined {
  return LEGAJOS.find((l) => l.id === id);
}
