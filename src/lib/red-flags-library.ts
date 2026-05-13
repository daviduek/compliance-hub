export interface RedFlagDefinition {
  code: string;
  level: 'baja' | 'media' | 'alta' | 'critica';
  title: string;
  whyItMatters: string;
  whatToRequest: string;
  manualReference: string;
}

export const RED_FLAGS_LIBRARY: Record<string, RedFlagDefinition> = {
  UBO_OFFSHORE_INDIRECT: {
    code: 'UBO_OFFSHORE_INDIRECT',
    level: 'alta',
    title: 'UBO indirecto en jurisdicción offshore',
    whyItMatters:
      'Las estructuras offshore son señaladas en el Manual Eluter Cap. VIII.G como factor de riesgo elevado por opacidad de control y dificultad para identificar al beneficiario final humano.',
    whatToRequest:
      'DJ Beneficiarios Finales del holding hasta llegar a personas humanas, escritura del holding y screening OFAC/ONU/RePET de los UBOs identificados.',
    manualReference: 'Manual Eluter Cap. VIII.G.1',
  },
  SAS_ARGENTINA: {
    code: 'SAS_ARGENTINA',
    level: 'alta',
    title: 'Estructura SAS (Sociedad por Acciones Simplificada)',
    whyItMatters:
      'Las SAS son listadas como categoría de mayor riesgo en el Manual Eluter Cap. VII.F.2.f por su flexibilidad societaria y menor exigencia documental al constituirse.',
    whatToRequest:
      'Documentación reforzada: estados contables del último ejercicio, descripción detallada del modelo de negocio y origen de los fondos aportados.',
    manualReference: 'Manual Eluter Cap. VII.F.2.f',
  },
  OBJETO_SOCIAL_NO_ALINEADO: {
    code: 'OBJETO_SOCIAL_NO_ALINEADO',
    level: 'alta',
    title: 'Objeto social no contempla la actividad solicitada',
    whyItMatters:
      'El estatuto debe respaldar legalmente la actividad que el cliente declara realizar. Si el objeto social no incluye operaciones con activos virtuales, hay riesgo de actuación ultra vires.',
    whatToRequest:
      'Acta de asamblea ampliando el objeto social para incluir explícitamente operaciones de activos virtuales, o nota legal del cliente justificando el encuadre.',
    manualReference: 'Manual Eluter Cap. VI.C.3',
  },
  AFIP_CODE_MISMATCH: {
    code: 'AFIP_CODE_MISMATCH',
    level: 'media',
    title: 'Código de actividad AFIP inconsistente',
    whyItMatters:
      'El código de actividad declarado ante AFIP no coincide con la actividad operativa real. Indica posible elusión fiscal o cambio de modelo de negocio no formalizado.',
    whatToRequest:
      'Constancia AFIP actualizada con el código correcto o justificación de por qué se mantiene el actual.',
    manualReference: 'Manual Eluter Cap. VI.D.2',
  },
  VOLUMEN_VS_ACTIVIDAD: {
    code: 'VOLUMEN_VS_ACTIVIDAD',
    level: 'alta',
    title: 'Volumen declarado desproporcionado vs. antigüedad y actividad',
    whyItMatters:
      'Una sociedad recién constituida que declara un volumen mensual significativo sin EECC que lo respalden es señal de operación de pase o cuenta de terceros.',
    whatToRequest:
      'Estados contables o flujos bancarios de los últimos 6 meses, justificación documentada del origen de los fondos y declaración de no operar por cuenta de terceros.',
    manualReference: 'Manual Eluter Cap. VIII.E.4',
  },
  PEP_EXTRANJERA: {
    code: 'PEP_EXTRANJERA',
    level: 'alta',
    title: 'PEP extranjera entre UBOs o autoridades',
    whyItMatters:
      'Las PEPs extranjeras requieren Debida Diligencia Reforzada por mandato regulatorio (Resolución UIF 76/2019 y siguientes).',
    whatToRequest:
      'DJ PEP firmada por la persona identificada, justificación del origen de fondos y aprobación por escrito del Oficial de Cumplimiento.',
    manualReference: 'Manual Eluter Cap. VII.G',
  },
  GAFI_GRAY_LIST: {
    code: 'GAFI_GRAY_LIST',
    level: 'alta',
    title: 'País involucrado en lista GAFI bajo monitoreo intensificado',
    whyItMatters:
      'Operar con o desde jurisdicciones del listado GAFI gris/negro requiere DDR y monitoreo continuo reforzado.',
    whatToRequest:
      'Justificación operativa del vínculo con la jurisdicción y screening adicional sobre las contrapartes involucradas.',
    manualReference: 'Manual Eluter Cap. VII.E.1',
  },
  OFAC_MATCH: {
    code: 'OFAC_MATCH',
    level: 'critica',
    title: 'Match positivo en lista OFAC SDN',
    whyItMatters:
      'Toda relación con un sujeto designado por OFAC es prohibida y debe ser reportada. Operar implicaría sanciones severas para la entidad.',
    whatToRequest:
      'Rechazo inmediato. Elevación al Oficial de Cumplimiento y al Directorio. Evaluar reporte de operación sospechosa.',
    manualReference: 'OFAC SDN List · 31 CFR § 501',
  },
  DOCUMENTACION_FALSIFICADA: {
    code: 'DOCUMENTACION_FALSIFICADA',
    level: 'critica',
    title: 'Documentación presuntamente falsificada',
    whyItMatters:
      'La presentación de documentos apócrifos es causal de rechazo inmediato y posible reporte de operación sospechosa a la UIF.',
    whatToRequest:
      'Rechazo inmediato. Conservación del expediente. Elevación al Oficial de Cumplimiento para evaluación de ROS.',
    manualReference: 'Manual Eluter Cap. XI.B · Ley 25.246',
  },
  ACTIVIDAD_PROHIBIDA_TYC: {
    code: 'ACTIVIDAD_PROHIBIDA_TYC',
    level: 'critica',
    title: 'Actividad declarada incluida en listado de prohibidas',
    whyItMatters:
      'La actividad declarada por el cliente coincide con alguna de las prohibidas explícitamente en los T&C (juegos de azar no regulados, tráfico, LA/FT, pornografía, adelantos de efectivo, etc.).',
    whatToRequest:
      'Rechazo inmediato. No avanzar con el onboarding.',
    manualReference: 'T&C ArgyPay Sec. 4.2 · T&C Eluter Sec. 5.1',
  },
  CONTROL_PERSON_NO_IDENTIFICADO: {
    code: 'CONTROL_PERSON_NO_IDENTIFICADO',
    level: 'alta',
    title: 'Control Person no identificado claramente (MSB)',
    whyItMatters:
      'La Beneficial Ownership Rule de FinCEN requiere identificar tanto a los UBOs (≥25%) como a una Control Person individual. Sin esta última, el legajo está incompleto regulatoriamente.',
    whatToRequest:
      'Designación formal del Control Person en el Operating Agreement o resolución del board, junto con identificación gubernamental.',
    manualReference: '31 CFR § 1010.230 · Manual ADBLIDAI Sec. 4.2',
  },
  FBO_END_USERS_NO_DEFINIDOS: {
    code: 'FBO_END_USERS_NO_DEFINIDOS',
    level: 'media',
    title: 'Modelo FBO sin política definida sobre end-users',
    whyItMatters:
      'Bajo el modelo FBO/Virtual Accounts, el cliente downstream es responsable del KYC de sus end-users. ADBLIDAI no hereda esa identificación pero debe verificar que exista un programa.',
    whatToRequest:
      'AML program escrito del cliente que describa el procedimiento de identificación, monitoreo y reporte sobre sus end-users.',
    manualReference: 'Manual ADBLIDAI Sec. 7.3 (Análisis FBO)',
  },
  AML_PROGRAM_FALTANTE: {
    code: 'AML_PROGRAM_FALTANTE',
    level: 'alta',
    title: 'Programa AML del cliente no documentado',
    whyItMatters:
      'Cuando el cliente downstream es a su vez un MSB regulado, FinCEN requiere validar que cuenta con un programa AML formal antes de operar.',
    whatToRequest:
      'AML program escrito, designación de AML Officer, y resultado de la última auditoría independiente si aplica.',
    manualReference: 'BSA · 31 CFR § 1022.210',
  },
  W8_W9_FALTANTE: {
    code: 'W8_W9_FALTANTE',
    level: 'media',
    title: 'Formulario W-8BEN-E o W-9 faltante',
    whyItMatters:
      'IRS requiere certificación del status fiscal de la contraparte. Sin ella no se puede operar bajo cumplimiento tributario US.',
    whatToRequest:
      'W-9 si la entidad es US person; W-8BEN-E si es entidad extranjera. Vigencia menor a 3 años.',
    manualReference: 'IRS Form W-8BEN-E Instructions · Manual ADBLIDAI Sec. 5.4',
  },
  CONSENTIMIENTO_BCRA_FALTANTE: {
    code: 'CONSENTIMIENTO_BCRA_FALTANTE',
    level: 'alta',
    title: 'Consentimiento BCRA Comunicación A 7463 faltante',
    whyItMatters:
      'BCRA exige consentimiento expreso del titular para enrolar la cuenta a la vista al CVU. Sin él, ArgyPay no puede dar de alta la cuenta de pago.',
    whatToRequest:
      'Aceptación firmada por el titular declarando conformidad con la Comunicación A 7463.',
    manualReference: 'BCRA Com. A 7463 · Manual ArgyPay Cap. III.B',
  },
  CVU_TITULAR_NO_VALIDADO: {
    code: 'CVU_TITULAR_NO_VALIDADO',
    level: 'media',
    title: 'CVU declarado sin validación de titularidad',
    whyItMatters:
      'El CVU informado para acreditaciones debe pertenecer al cliente. Si no se valida, hay riesgo de operación por cuenta de terceros.',
    whatToRequest:
      'Constancia de CVU emitida por el PSP o entidad financiera donde figure el titular.',
    manualReference: 'Manual ArgyPay Cap. IV.A.2',
  },
  ESTADOS_CONTABLES_VENCIDOS: {
    code: 'ESTADOS_CONTABLES_VENCIDOS',
    level: 'media',
    title: 'Estados contables vencidos o ausentes',
    whyItMatters:
      'Sin EECC actualizados (menos de 18 meses) no es posible validar volumen declarado vs capacidad operativa real.',
    whatToRequest:
      'Último balance auditado o estados contables del ejercicio cerrado más reciente.',
    manualReference: 'Manual Eluter Cap. VI.E.1',
  },
  P2P_CASH_INTENSIVE: {
    code: 'P2P_CASH_INTENSIVE',
    level: 'alta',
    title: 'Modelo operativo P2P o cash-intensive',
    whyItMatters:
      'Las operaciones peer-to-peer y los negocios cash-intensive son explícitamente listados como disparadores de DDR en el Manual Eluter.',
    whatToRequest:
      'Descripción detallada del flujo operativo, controles de monitoreo y origen/destino esperado de los fondos.',
    manualReference: 'Manual Eluter Cap. VII.F.2.a',
  },
};
