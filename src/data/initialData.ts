import { InkItem, VarnishItem, CompatibilityRule, ProductionOrder, InspectionLog, SystemAuditEntry } from '../types';

export const INITIAL_INKS: InkItem[] = [
  {
    id: 'ink-silicona-1',
    name: 'Tinta Serie Antifricción con Alta Carga de Silicona',
    family: 'silicona',
    chemicalProperties: 'Alta concentración de polidimetilsiloxano (PDMS) y ceras sintéticas de deslizamiento.',
    requiresOxidationTimeHours: 48,
    siliconeContent: 'alta',
    dryingMechanism: 'Evaporación / Penetración',
    manufacturer: 'HuberGroup / Flint',
    recommendations: 'PROHIBIDA para barnizado UV estándar directo. Provoca tensión superficial muy baja (<28 dinas/cm), impidiendo el anclaje.'
  },
  {
    id: 'ink-oxidativa-1',
    name: 'Tinta Especial Secado Oxidativo Lento (Base Vegetal)',
    family: 'secado_lento',
    chemicalProperties: 'Alta concentración de aceites de linaza y soja sin secantes de cobalto pesados.',
    requiresOxidationTimeHours: 24,
    siliconeContent: 'nula',
    dryingMechanism: 'Oxidativo lento',
    manufacturer: 'Sun Chemical SunLit',
    recommendations: 'Requiere reposo estricto mínimo de 24 horas en bandejas aireadas antes de ingresar al tren UV para evitar inhibición por radicales.'
  },
  {
    id: 'ink-metalizada-1',
    name: 'Tinta Metalizada Oro Rico Brillante (Pigmento Escama)',
    family: 'metalizada',
    chemicalProperties: 'Partículas laminares de bronce y aluminio con barniz vehículo de secado moderado.',
    requiresOxidationTimeHours: 18,
    siliconeContent: 'media',
    dryingMechanism: 'Oxidativo lento',
    manufacturer: 'Eckart Pigments',
    recommendations: 'Requiere barniz formulación especial de anclaje reforzado o primer previo. Riesgo de decantación y deslaminación de partículas metálicas.'
  },
  {
    id: 'ink-uv-1',
    name: 'Tinta UV Offset 100% Sólidos (Polimerización Pura)',
    family: 'uv_offset',
    chemicalProperties: 'Monómeros y oligómeros de acrilato con fotoiniciadores tipo I y II. 0% VOC.',
    requiresOxidationTimeHours: 0,
    siliconeContent: 'nula',
    dryingMechanism: 'Polimerización UV instantánea',
    manufacturer: 'Siegwerk SICURA',
    recommendations: 'Compatibilidad óptima inmediata (Paso directo inter-deck o en línea). Anclaje garantizado sin tiempo de reposo.'
  },
  {
    id: 'ink-fluo-1',
    name: 'Tinta Fluorescente Neón Verde Lima Pantone 802C',
    family: 'fluorescente',
    chemicalProperties: 'Colorantes fluorescentes en resina termoplástica frágil con solventes oxigenados.',
    requiresOxidationTimeHours: 16,
    siliconeContent: 'nula',
    dryingMechanism: 'Mixto',
    manufacturer: 'Day-Glo / Sun Chemical',
    recommendations: 'Requiere control de temperatura del sustrato (<45°C) en el horno UV para evitar degradación térmica del pigmento fosforescente.'
  },
  {
    id: 'ink-conv-1',
    name: 'Tinta Offset Convencional Serie Pro (Cuatricromía)',
    family: 'convencional_estandar',
    chemicalProperties: 'Pigmentos orgánicos micronizados con aceites minerales y vegetales balanceados.',
    requiresOxidationTimeHours: 12,
    siliconeContent: 'nula',
    dryingMechanism: 'Oxidativo lento',
    manufacturer: 'Toyo Ink',
    recommendations: 'Comportamiento estándar. Requiere 12 horas de curado oxidativo preliminar antes del barnizado final.'
  }
];

export const INITIAL_VARNISHES: VarnishItem[] = [
  {
    id: 'varnish-std-brillo',
    name: 'Barniz UV Radical Libre Ultra-Brillo Estándar 8100',
    type: 'radical_libre_brillante',
    viscosityCps: 180,
    photoinitiatorType: 'Alfa-hidroxicetona + Benzofenona (Radical Libre)',
    recommendedPowerWattsInch: 300,
    recommendedMaxSpeedMMin: 35,
    manufacturer: 'Actega TerraWet UV',
    notes: 'Excelente brillo (>92 GU) y nivelación. Altamente sensible a la inhibición por ceras y siliconas. No usar sobre tintas antifricción.'
  },
  {
    id: 'varnish-esp-adhesion',
    name: 'Barniz UV Especial Anclaje Reforzado Grip-Bond 9500',
    type: 'especial_adhesion',
    viscosityCps: 240,
    photoinitiatorType: 'Óxido de Bis-Acilfosfina (BAPO) + Co-iniciadores aminares',
    recommendedPowerWattsInch: 320,
    recommendedMaxSpeedMMin: 28,
    manufacturer: 'Zeller+Gmelin Uvalux',
    notes: 'Formulado con monómeros ácidos promotores de adherencia sobre sustratos de baja tensión y tintas metalizadas / sintéticas.'
  },
  {
    id: 'varnish-mate',
    name: 'Barniz UV Mate Seda Reticulado 8400',
    type: 'radical_libre_mate',
    viscosityCps: 210,
    photoinitiatorType: 'Radical Libre con agentes matizantes de sílice tratada',
    recommendedPowerWattsInch: 300,
    recommendedMaxSpeedMMin: 30,
    manufacturer: 'Actega ArtCoat Mate',
    notes: 'Acabado suave sedoso. Requiere control riguroso de velocidad para evitar brillo desuniforme o manchas por baja dosificación.'
  },
  {
    id: 'varnish-drip-off',
    name: 'Barniz UV Efectos Especiales Drip-Off Reticulable',
    type: 'drip_off',
    viscosityCps: 195,
    photoinitiatorType: 'Doble sistema de reticulación superficial y profunda',
    recommendedPowerWattsInch: 320,
    recommendedMaxSpeedMMin: 25,
    manufacturer: 'Flint Group Novavit UV',
    notes: 'Produce contraste brillo-mate por tensión diferencial sobre aceite primer base. Exige dosificación precisa de potencia UV.'
  }
];

export const COMPATIBILITY_RULES: CompatibilityRule[] = [
  {
    inkFamily: 'silicona',
    varnishType: 'radical_libre_brillante',
    status: 'bloqueado',
    minOxidationHours: 999,
    reason: 'INCOMPATIBILIDAD FISICOQUÍMICA CRÍTICA: Las cadenas de silicona migran a la interfase causando rechazo termodinámico de mojabilidad. Desprendimiento 100% asegurado en Cross-Hatch Test.',
    actionRequired: 'BLOQUEAR ORDEN. Reemplazar tinta por formulación sin silicona o aplicar Barniz de Anclaje Reforzado con primer promotor.',
    technicalStandard: 'ASTM D3359 / ISO 2409 (Grado 0B / Falla Total)'
  },
  {
    inkFamily: 'silicona',
    varnishType: 'radical_libre_mate',
    status: 'bloqueado',
    minOxidationHours: 999,
    reason: 'INCOMPATIBILIDAD QUÍMICA: La silicona desestabiliza la sílice matizante del barniz provocando descamación inmediata en pliegos.',
    actionRequired: 'BLOQUEAR ORDEN. No proceder al barnizado UV sin reformulación de tinta.',
    technicalStandard: 'Ficha de Seguridad y Calidad Impresos El Día S.A.S.'
  },
  {
    inkFamily: 'silicona',
    varnishType: 'especial_adhesion',
    status: 'condicionado',
    minOxidationHours: 48,
    reason: 'COMPATIBLE BAJO PROTOCOLO ESTRICTO: El barniz contiene promotores polares que vencen la baja tensión superficial, siempre que se deje reposo de 48h y se reduzca velocidad a 25 m/min.',
    actionRequired: 'Validación obligatoria de Gate-Review con pliego piloto antes de liberar tiraje completo.',
    technicalStandard: 'Protocolo Especial Auditoría Medellín Q3-2026'
  },
  {
    inkFamily: 'secado_lento',
    varnishType: 'radical_libre_brillante',
    status: 'condicionado',
    minOxidationHours: 24,
    reason: 'RIESGO DE INHIBICIÓN POR OXÍGENO Y VAPORES: Si la tinta vegetal no ha completado el ciclo de secado oxidativo, los aceites liberan compuestos que impiden la polimerización profunda del barniz.',
    actionRequired: 'Cumplir obligatoriamente mínimo 24 horas de reposo en bandejas aireadas antes de alimentar la barnizadora UV.',
    technicalStandard: 'ISO 12647-2 / Especificación Técnica Impresos El Día'
  },
  {
    inkFamily: 'metalizada',
    varnishType: 'radical_libre_brillante',
    status: 'condicionado',
    minOxidationHours: 18,
    reason: 'RIESGO DE DELAMINACIÓN: Las escamas de metal interfieren con el paso de luz UV hacia el fondo de la película. Requiere lámpara a 320 W/in y velocidad moderada.',
    actionRequired: 'Ajustar velocidad a ≤ 28 m/min y verificar prueba de cinta 3M con corte en cruz al 100% de anclaje.',
    technicalStandard: 'Norma Técnica Colombiana NTC / ISO 2409'
  },
  {
    inkFamily: 'uv_offset',
    varnishType: 'radical_libre_brillante',
    status: 'optimo',
    minOxidationHours: 0,
    reason: 'HOMOLOGACIÓN PERFECTA: Unión química por copolimerización de acrilatos inter-red. Coeficiente de adherencia 100% garantizado sin tiempo de reposo.',
    actionRequired: 'Proceder a velocidad normal de producción (30-35 m/min).',
    technicalStandard: 'ISO 9001:2015 Certificado Planta Medellín'
  },
  {
    inkFamily: 'uv_offset',
    varnishType: 'especial_adhesion',
    status: 'optimo',
    minOxidationHours: 0,
    reason: 'MÁXIMA COHESIÓN: Anclaje perfecto entre tintas UV reactivas y barniz adhesivo.',
    actionRequired: 'Apto para empaque farmacéutico y cosmético de alta exigencia.',
    technicalStandard: 'ISO 9001 / ISO 14001'
  },
  {
    inkFamily: 'convencional_estandar',
    varnishType: 'radical_libre_brillante',
    status: 'condicionado',
    minOxidationHours: 12,
    reason: 'Requiere reposo estándar de 12 horas para consolidar el film oxidativo antes del choque térmico UV.',
    actionRequired: 'Monitorear bitácora de reposo antes de liberar a máquina.',
    technicalStandard: 'Manual de Procedimientos P-CAL-04'
  }
];

export const INITIAL_ORDERS: ProductionOrder[] = [
  {
    id: 'op-2026-4081',
    opNumber: 'OP-4081',
    client: 'Laboratorios Farmacéuticos de Antioquia',
    jobDescription: 'Cajas Plegadizas Jarabe Vitamínico 120ml - Acabado UV Brillo',
    substrateType: 'Cartón Folding Calibre 14 (300g/m²)',
    substrateGrammage: 300,
    inkId: 'ink-uv-1',
    varnishId: 'varnish-std-brillo',
    sheetsQuantity: 15000,
    createdAt: '2026-10-27T08:30:00Z',
    createdByRole: 'jefe_produccion',
    compatibilityStatus: 'optimo',
    compatibilityNotes: 'Tinta UV Offset y Barniz Radical Libre 100% compatibles por copolimerización.',
    isBlocked: false,
    requiredOxidationHours: 0,
    oxidationStartTime: '2026-10-27T08:35:00Z',
    oxidationCompleted: true,
    actualOxidationHours: 2,
    uvSettings: {
      bandSpeedMMin: 32,
      lampPowerWattsInch: 300,
      substrateTempCelsius: 41,
      calculatedDoseMjCm2: 245,
      lampsActive: 2,
      calibratedBy: 'Carlos Mario Restrepo (Operario UV)',
      calibratedAt: '2026-10-27T10:15:00Z'
    },
    adhesionTest: {
      testedAt: '2026-10-27T10:30:00Z',
      testerName: 'Valeria Henao (Coord. Calidad)',
      testerRole: 'coordinador_calidad',
      method: 'Ambos',
      adhesionPercentage: 100,
      astmClass: '5B',
      passed: true,
      recalibrationAttempts: 0,
      observations: 'Anclaje total (0% desprendimiento de bordes en cuadrícula Cross-Hatch). Brillo uniforme >94 GU.'
    },
    releaseInfo: {
      releasedAt: '2026-10-27T10:45:00Z',
      authorizedBy: 'Ing. Rodrigo Gómez (Jefe de Post-Prensa)',
      signatureRole: 'jefe_produccion',
      wasteSheets: 25,
      notes: 'Lote liberado a producción masiva con total conformidad ISO 9001.'
    },
    currentStep: 6,
    status: 'completada'
  },
  {
    id: 'op-2026-4082',
    opNumber: 'OP-4082',
    client: 'Industrias Cosméticas Medellín',
    jobDescription: 'Estuches Perfume Gold Edition - Fondo Negro Antifricción y Brillo Sectorizado',
    substrateType: 'Cartulina Sulfatada 1 Cara 320g/m²',
    substrateGrammage: 320,
    inkId: 'ink-silicona-1',
    varnishId: 'varnish-std-brillo',
    sheetsQuantity: 8500,
    createdAt: '2026-10-28T07:15:00Z',
    createdByRole: 'operario_uv',
    compatibilityStatus: 'bloqueado',
    compatibilityNotes: 'BLOQUEO AUTOMÁTICO DE SEGURIDAD: Incompatibilidad fisicoquímica crítica entre silicona PDMS y barniz UV radical libre.',
    isBlocked: true,
    blockReason: 'PELIGRO DE DESPRENDIMIENTO MASIVO: Se detectó tinta con alta carga de silicona junto a Barniz Estándar 8100. La matriz técnica bloqueó el avance para evitar pérdidas por reproceso.',
    requiredOxidationHours: 48,
    oxidationStartTime: '2026-10-28T07:20:00Z',
    oxidationCompleted: false,
    actualOxidationHours: 3.5,
    uvSettings: {
      bandSpeedMMin: 30,
      lampPowerWattsInch: 300,
      substrateTempCelsius: 38,
      calculatedDoseMjCm2: 230,
      lampsActive: 2,
      calibratedBy: 'En espera de reprogramación',
    },
    currentStep: 1,
    status: 'bloqueada'
  },
  {
    id: 'op-2026-4083',
    opNumber: 'OP-4083',
    client: 'Editorial El Café S.A.S.',
    jobDescription: 'Carátula Revista Gourmet Antioqueña - Tinta Escama Metálica y Barniz Mate',
    substrateType: 'Papel Propalcote 300g/m²',
    substrateGrammage: 300,
    inkId: 'ink-metalizada-1',
    varnishId: 'varnish-esp-adhesion',
    sheetsQuantity: 12000,
    createdAt: '2026-10-27T14:00:00Z',
    createdByRole: 'jefe_produccion',
    compatibilityStatus: 'condicionado',
    compatibilityNotes: 'Condicionado: Tinta metalizada con barniz de adhesión reforzada. Requiere 18h de secado oxidativo y velocidad controlada.',
    isBlocked: false,
    requiredOxidationHours: 18,
    oxidationStartTime: '2026-10-27T14:15:00Z',
    oxidationCompleted: true,
    actualOxidationHours: 20,
    uvSettings: {
      bandSpeedMMin: 27,
      lampPowerWattsInch: 320,
      substrateTempCelsius: 43,
      calculatedDoseMjCm2: 285,
      lampsActive: 2,
      calibratedBy: 'Carlos Mario Restrepo',
      calibratedAt: '2026-10-28T10:20:00Z'
    },
    adhesionTest: {
      testedAt: '2026-10-28T10:40:00Z',
      testerName: 'Valeria Henao',
      testerRole: 'coordinador_calidad',
      method: 'Cinta_3M_610',
      adhesionPercentage: 100,
      astmClass: '5B',
      passed: true,
      recalibrationAttempts: 1,
      observations: 'Primera prueba a 32 m/min arrojó leve desprendimiento (4B). Se recalibró a 27 m/min y 320 W/in obteniendo 100% de anclaje (5B).'
    },
    currentStep: 5,
    status: 'produccion_masiva'
  },
  {
    id: 'op-2026-4084',
    opNumber: 'OP-4084',
    client: 'Empaques de Colombia S.A.',
    jobDescription: 'Plegadizas Galletas Premium - Tintas Secado Lento Vegetal',
    substrateType: 'Cartón Sulfatado 280g/m²',
    substrateGrammage: 280,
    inkId: 'ink-oxidativa-1',
    varnishId: 'varnish-std-brillo',
    sheetsQuantity: 20000,
    createdAt: '2026-10-28T09:00:00Z',
    createdByRole: 'jefe_produccion',
    compatibilityStatus: 'condicionado',
    compatibilityNotes: 'Esperando cumplimiento de 24 horas de reposo oxidativo antes de entrar a túnel UV.',
    isBlocked: false,
    requiredOxidationHours: 24,
    oxidationStartTime: '2026-10-28T09:10:00Z',
    oxidationCompleted: false,
    actualOxidationHours: 2.8,
    uvSettings: {
      bandSpeedMMin: 28,
      lampPowerWattsInch: 310,
      substrateTempCelsius: 39,
      calculatedDoseMjCm2: 250,
      lampsActive: 2,
      calibratedBy: 'Pendiente de inicio de calibración',
    },
    currentStep: 2,
    status: 'oxidacion_espera'
  }
];

export const INITIAL_INSPECTIONS: InspectionLog[] = [
  {
    id: 'insp-101',
    opId: 'op-2026-4081',
    opNumber: 'OP-4081',
    timestamp: '2026-10-27T10:30:00Z',
    inspectorName: 'Valeria Henao',
    inspectorRole: 'coordinador_calidad',
    bandSpeed: 32,
    lampPower: 300,
    substrateTemp: 41,
    crossHatchResult: 'Clase 5B - Ningún desprendimiento en bordes ni cuadrículas',
    adhesionPercent: 100,
    verdict: 'APROBADO',
    correctiveAction: 'Ninguna. Proceso en ventana operativa óptima.'
  },
  {
    id: 'insp-102',
    opId: 'op-2026-4083',
    opNumber: 'OP-4083',
    timestamp: '2026-10-28T10:15:00Z',
    inspectorName: 'Carlos Mario Restrepo',
    inspectorRole: 'operario_uv',
    bandSpeed: 34,
    lampPower: 290,
    substrateTemp: 34,
    crossHatchResult: 'Clase 4B - Descamación menor en intersecciones (~4%)',
    adhesionPercent: 96,
    verdict: 'RECALIBRAR',
    correctiveAction: 'Se redujo velocidad de banda de 34 a 27 m/min y se incrementó potencia de lámparas a 320 W/in.'
  },
  {
    id: 'insp-103',
    opId: 'op-2026-4083',
    opNumber: 'OP-4083',
    timestamp: '2026-10-28T10:40:00Z',
    inspectorName: 'Valeria Henao',
    inspectorRole: 'coordinador_calidad',
    bandSpeed: 27,
    lampPower: 320,
    substrateTemp: 43,
    crossHatchResult: 'Clase 5B - 100% de anclaje perfecto tras recalibración',
    adhesionPercent: 100,
    verdict: 'APROBADO',
    correctiveAction: 'Recalibración exitosa. Pliego piloto conforme. Liberado a tiraje masivo.'
  }
];

export const INITIAL_AUDIT_LOGS: SystemAuditEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-10-28T07:15:30Z',
    action: 'BLOQUEO_AUTOMÁTICO_INCOMPATIBILIDAD',
    userRole: 'operario_uv',
    details: 'El sistema bloqueó automáticamente la OP-4082 al detectar Tinta de Silicona y Barniz UV Radical Libre Estándar. Riesgo crítico evitado.',
    severity: 'CRITICAL',
    hash: 'a9f24b81c20e481e8b918f0a0d924719b'
  },
  {
    id: 'aud-002',
    timestamp: '2026-10-28T10:15:22Z',
    action: 'RECALIBRACIÓN_GATE_REVIEW',
    userRole: 'coordinador_calidad',
    details: 'Gate-Review en OP-4083 detectó anclaje 96% (<100%). Se activó parada técnica y recalibración de lámparas UV a 320 W/in.',
    severity: 'WARNING',
    hash: 'e810a9f147b3127ec8390b17192a0e41f'
  },
  {
    id: 'aud-003',
    timestamp: '2026-10-28T10:45:00Z',
    action: 'LIBERACIÓN_PRODUCCIÓN_MASIVA',
    userRole: 'jefe_produccion',
    details: 'Jefe de producción autorizó formalmente tiraje de 12.000 pliegos para OP-4083 con certificación 100% anclaje.',
    severity: 'INFO',
    hash: '77c08e5f2998a14b38d01a91e5e0129bc'
  }
];
