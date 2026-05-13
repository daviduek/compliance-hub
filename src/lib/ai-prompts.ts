import type { Legajo } from './types';

export interface PromptTemplate {
  name: string;
  description: string;
  build: (legajo: Legajo) => string;
}

export const PROMPT_CLASSIFICATION: PromptTemplate = {
  name: 'Clasificación de cliente',
  description: 'Determina entidad regulada aplicable, tipo de cliente y nivel preliminar de riesgo.',
  build: (l) => `Sos un Oficial de Cumplimiento experto en regulación argentina (UIF/BCRA) y estadounidense (FinCEN/OFAC).

Cliente:
- Razón social: ${l.clientLegalName}
- Tax ID: ${l.taxId}
- País de constitución: ${l.countryOfIncorporation}
- Forma jurídica: ${l.corporateForm}
- Actividad declarada: ${l.declaredActivity}
- Servicio solicitado: ${l.requestedService}
- Volumen mensual estimado: ${l.expectedMonthlyVolume}
- Países involucrados: ${l.countriesInvolved.join(', ')}
- Monedas: ${l.currenciesInvolved.join(', ')}

Tarea:
1. Determiná bajo cuál de las tres entidades reguladas corresponde encuadrar al cliente: Eluter SA (PSAV/AR), ArgyPay SA (PSP/AR) o ADBLIDAI LLC (MSB/US).
2. Clasificá al cliente en una categoría operativa.
3. Estimá un riesgo preliminar (bajo / medio / alto / crítico) con justificación de 2-3 oraciones.
4. Listá los disparadores de alto riesgo aplicables según los manuales internos.

Respondé en JSON estructurado.`,
};

export const PROMPT_DOC_EXTRACTION: PromptTemplate = {
  name: 'Extracción de documentos',
  description: 'Extrae campos clave de los documentos subidos (estatuto, DJ BF, EIN, etc.).',
  build: (l) => `Te paso los documentos del legajo ${l.id} (${l.clientLegalName}) para extracción estructurada.

Documentos disponibles:
${l.documents.map((d) => `- [${d.status}] ${d.label}${d.filename ? ` (${d.filename})` : ''}`).join('\n')}

Para cada documento aplicable extraé:
- Tipo de documento
- Emisor y fecha de emisión
- Vigencia / vencimiento
- Personas mencionadas (razón social, DNI/EIN, rol, % de capital)
- Objeto social (si aplica)
- Códigos de actividad (si aplica)
- Banderas de calidad: ilegibilidad, falta de firma, signos de adulteración

Respondé en JSON con un objeto por documento. Si un documento es ilegible o sospechoso, marcalo en la salida.`,
};

export const PROMPT_CROSS_VALIDATION: PromptTemplate = {
  name: 'Validación cruzada',
  description: 'Compara campos entre documentos para detectar inconsistencias.',
  build: (l) => `Validación cruzada del legajo ${l.id} — ${l.clientLegalName}.

Comparar los siguientes ítems entre todos los documentos extraídos y la declaración del cliente:
1. Razón social / nombre fantasía
2. Tax ID (CUIT o EIN)
3. Domicilio fiscal
4. Objeto social / actividad declarada
5. Autoridades vigentes y plazos
6. % de participación de cada UBO (sumar 100%)
7. Coherencia entre código AFIP, actividad declarada y servicio solicitado
8. Coherencia entre volumen declarado (${l.expectedMonthlyVolume}) y antigüedad / capacidad operativa
9. Países declarados vs jurisdicciones de UBOs

Para cada inconsistencia, devolvé:
- Campo afectado
- Valor en documento A vs documento B
- Severidad (info / warning / critical)
- Acción sugerida`,
};

export const PROMPT_RED_FLAGS: PromptTemplate = {
  name: 'Detección de red flags',
  description: 'Aplica la biblioteca de red flags al perfil del cliente.',
  build: (l) => `Aplicá la biblioteca interna de red flags al legajo ${l.id}.

Perfil:
- Entidad aplicable: ${l.entityScope}
- Forma jurídica: ${l.corporateForm}
- País: ${l.countryOfIncorporation}
- Actividad: ${l.declaredActivity}
- Volumen declarado: ${l.expectedMonthlyVolume}
- UBOs: ${l.beneficialOwners.map((u) => `${u.fullName} (${u.capitalPercentage}%, ${u.jurisdiction}${u.isPep ? ', PEP' : ''})`).join(' | ')}
- Países involucrados: ${l.countriesInvolved.join(', ')}

Por cada red flag aplicable de la biblioteca interna, devolvé:
- Código del red flag
- Nivel (baja/media/alta/critica)
- Descripción contextualizada al cliente
- Referencia al manual interno
- Documentación a solicitar para mitigarlo`,
};

export const PROMPT_CLIENT_MESSAGE: PromptTemplate = {
  name: 'Redacción de pedido al cliente',
  description: 'Redacta el mail/mensaje formal al cliente solicitando subsanación.',
  build: (l) => `Redactá un mensaje formal al cliente ${l.clientLegalName} (contacto ${l.primaryContact}) solicitando subsanación.

Items a solicitar (basados en docs faltantes y red flags abiertas):
${l.documents.filter((d) => d.status === 'faltante_obligatorio' || d.status === 'vencido' || d.status === 'ilegible').map((d) => `- ${d.label}`).join('\n')}
${l.redFlags.filter((f) => f.status === 'abierta').map((f) => `- ${f.whatToRequest}`).join('\n')}

Tono: profesional, claro, sin jerga interna. Idioma: ${l.entityScope === 'MSB' ? 'inglés' : 'español rioplatense'}.
Estructura:
1. Saludo nominal.
2. Contexto breve (estamos completando la onboarding de su entidad bajo ${l.entityScope}).
3. Lista numerada de pedidos con explicación de por qué cada uno es necesario.
4. Plazo de respuesta de 7 días hábiles.
5. Cierre profesional con firma del analista ${l.assignedAnalyst}.`,
};

export const ALL_PROMPTS: PromptTemplate[] = [
  PROMPT_CLASSIFICATION,
  PROMPT_DOC_EXTRACTION,
  PROMPT_CROSS_VALIDATION,
  PROMPT_RED_FLAGS,
  PROMPT_CLIENT_MESSAGE,
];
