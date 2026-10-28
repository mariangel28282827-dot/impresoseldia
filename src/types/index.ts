/**
 * Tipos e interfaces del Sistema de Gestión y Estandarización de Acabados UV (SIGE-UV)
 * IMPRESOS EL DÍA S.A.S. - Planta Medellín
 */

export type RoleType = 'jefe_produccion' | 'operario_uv' | 'coordinador_calidad';

export type IncompatibilityRisk = 'bloqueado' | 'condicionado' | 'optimo';

export interface InkItem {
  id: string;
  name: string;
  family: 'silicona' | 'secado_lento' | 'metalizada' | 'uv_offset' | 'fluorescente' | 'convencional_estandar';
  chemicalProperties: string;
  requiresOxidationTimeHours: number;
  siliconeContent: 'alta' | 'media' | 'nula';
  dryingMechanism: 'Oxidativo lento' | 'Polimerización UV instantánea' | 'Evaporación / Penetración' | 'Mixto';
  manufacturer: string;
  recommendations: string;
}

export interface VarnishItem {
  id: string;
  name: string;
  type: 'radical_libre_brillante' | 'radical_libre_mate' | 'especial_adhesion' | 'drip_off' | 'bajo_olor';
  viscosityCps: number;
  photoinitiatorType: string;
  recommendedPowerWattsInch: number;
  recommendedMaxSpeedMMin: number;
  manufacturer: string;
  notes: string;
}

export interface CompatibilityRule {
  inkFamily: InkItem['family'];
  varnishType: VarnishItem['type'];
  status: IncompatibilityRisk;
  minOxidationHours: number;
  reason: string;
  actionRequired: string;
  technicalStandard: string;
}

export type OPStatus = 
  | 'recepcion' 
  | 'oxidacion_espera' 
  | 'calibracion_uv' 
  | 'gate_review_adherencia' 
  | 'produccion_masiva' 
  | 'control_final' 
  | 'bloqueada' 
  | 'completada' 
  | 'rechazada_merma';

export interface ProductionOrder {
  id: string;
  opNumber: string;
  client: string;
  jobDescription: string;
  substrateType: string; // Ej: Folding Calibre 14, Propalcote 300g, Cartulina sulfatada
  substrateGrammage: number;
  inkId: string;
  varnishId: string;
  sheetsQuantity: number;
  createdAt: string;
  createdByRole: RoleType;
  
  // Paso 1: Matriz Homologación
  compatibilityStatus: IncompatibilityRisk;
  compatibilityNotes: string;
  isBlocked: boolean;
  blockReason?: string;
  
  // Paso 2: Tiempo de Reposo / Oxidación
  requiredOxidationHours: number;
  oxidationStartTime: string;
  oxidationCompleted: boolean;
  actualOxidationHours: number;
  
  // Paso 3: Parámetros de Curado UV
  uvSettings: {
    bandSpeedMMin: number;       // Metros por minuto (óptimo 25-35)
    lampPowerWattsInch: number;  // Watts/pulgada (óptimo 280-320)
    substrateTempCelsius: number;// Temperatura sustrato (óptimo 35-48 °C)
    calculatedDoseMjCm2: number; // Dosis estimada mJ/cm²
    lampsActive: number;         // 1, 2 o 3 lámparas
    calibratedBy: string;
    calibratedAt?: string;
  };

  // Paso 4: Gate-Review Prueba Adherencia (Cross-Hatch / Cinta 3M)
  adhesionTest?: {
    testedAt: string;
    testerName: string;
    testerRole: RoleType;
    method: 'Cinta_3M_610' | 'Cross_Hatch_ISO2409' | 'Ambos';
    adhesionPercentage: number; // 0 a 100% (Requerido 100% para aprobar)
    astmClass: '5B' | '4B' | '3B' | '2B' | '1B' | '0B';
    passed: boolean;
    recalibrationAttempts: number;
    observations: string;
  };

  // Paso 5: Liberación Masiva
  releaseInfo?: {
    releasedAt: string;
    authorizedBy: string;
    signatureRole: RoleType;
    wasteSheets: number;
    notes: string;
  };

  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  status: OPStatus;
}

export interface InspectionLog {
  id: string;
  opId: string;
  opNumber: string;
  timestamp: string;
  inspectorName: string;
  inspectorRole: RoleType;
  bandSpeed: number;
  lampPower: number;
  substrateTemp: number;
  crossHatchResult: string;
  adhesionPercent: number;
  verdict: 'APROBADO' | 'RECALIBRAR' | 'RECHAZADO_MERMA';
  correctiveAction?: string;
}

export interface SystemAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  userRole: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SECURITY';
  hash?: string;
}

export interface BackupData {
  version: string;
  appName: string;
  exportedAt: string;
  checksum: string;
  orders: ProductionOrder[];
  inks: InkItem[];
  varnishes: VarnishItem[];
  inspectionLogs: InspectionLog[];
  auditLogs: SystemAuditEntry[];
}
